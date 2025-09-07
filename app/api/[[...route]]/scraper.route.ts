import { zValidator } from "@hono/zod-validator";
import axios from "axios";
import { Hono } from "hono";
import * as cheerio from "cheerio";
import schema from "@/schema";

function getDomain(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, ""); // remove "www."
  } catch {
    return url; // fallback if URL is invalid
  }
}
function getGoogleMapsMidpointFromString(bboxStr: string): string {
  // Parse the string into a 2D number array
  const bbox: [[number, number], [number, number]] = JSON.parse(bboxStr);

  const [[lat1, lng1], [lat2, lng2]] = bbox;

  const midLat = +((lat1 + lat2) / 2).toFixed(6);
  const midLng = +((lng1 + lng2) / 2).toFixed(6);

  return `@${midLat},${midLng},10z`;
}

async function searchGoogleMaps({
  apiKey,
  searchQuery,
  ll,
  pagesNumber,
}: {
  apiKey: string;
  searchQuery: string;
  ll: string;
  pagesNumber: number;
}) {
  const url = "https://serpapi.com/search.json";
  const businesses = [];

  for (let i = 0; i < pagesNumber; i++) {
    const params = {
      engine: "google_maps",
      type: "search",
      q: searchQuery,
      ll,
      api_key: apiKey,
      start: i * 20,
    };

    const { data } = await axios.get(url, { params });

    if (data?.local_results?.length) {
      for (const result of data.local_results) {
        if (result.website) {
          businesses.push({
            name: result.title || "",
            website: result.website || "",
            phone: result.phone || "",
            email: "",
          });
        }
      }
    } else {
      break;
    }
  }

  return businesses;
}
function extractEmails(html: string) {
  const allEmails = Array.from(
    new Set(
      html.match(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g) || []
    )
  );

  // Blacklist patterns (placeholders, staging, error tracking, assets)
  const blacklist = [
    /^example@/i, // example@...
    /^user@/i, // user@...
    /^name@mail\.com$/i, // name@mail.com (placeholder)
    /^info@example\.com$/i, // info@example.com
    /@example\.com$/i, // example.com domain
    /@mysite\.com$/i, // placeholder domains
    /@domain\.com$/i, // generic test domains
    /@.*sentry.*\./i, // any sentry (sentry.io, sentry.com, sentry-next.wixpress.com, etc.)
    /@.*sg-host\.com$/i, // WP staging
    /\.(jpg|jpeg|png|gif|webp)$/i, // image filenames
    /@\d+(\.\d+)?x/i, // @2x, @0.75x, etc.
  ];

  return allEmails.filter((email) => !blacklist.some((rx) => rx.test(email)));
}

async function crawlWebsite(startUrl: string) {
  const visited = new Set();
  const toVisit = [startUrl];
  const emails = new Set();

  const base = new URL(startUrl).origin;

  while (toVisit.length && visited.size < 20) {
    const url = toVisit.shift() ?? "";
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const { data: html } = await axios.get(url, { timeout: 10000 });

      // collect emails
      extractEmails(html).forEach((e) => emails.add(e));

      // optionally collect socials

      // add internal links to crawl
      const $ = cheerio.load(html);
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;

        let fullUrl;
        try {
          fullUrl = new URL(href, base).href;
        } catch (_) {
          return;
        }

        if (fullUrl.startsWith(base) && !visited.has(fullUrl)) {
          toVisit.push(fullUrl);
        }
      });
    } catch (_) {
      // skip errors silently
    }
  }

  return {
    emails: Array.from(emails),
  };
}

const app = new Hono().post("/", zValidator("json", schema), async (c) => {
  try {
    const { apiKey, searchQuery, pagesNumber, location } = c.req.valid("json");
    console.log(`🚀 Starting scraper for "${searchQuery}" in "${location}"`);

    const ll = getGoogleMapsMidpointFromString(location);

    const results = await searchGoogleMaps({
      apiKey,
      searchQuery,
      pagesNumber,
      ll,
    });

    const leads = [];

    for (const biz of results) {
      console.log(`🌐 Crawling ${biz.website}`);
      try {
        const { emails } = await crawlWebsite(biz.website);

        if (emails.length) {
          // push each found email separately
          for (const email of emails) {
            leads.push({
              name: biz.name,
              website: getDomain(biz.website),
              phone: biz.phone,
              email,
            });
          }
        } else {
          // still push with empty email
          leads.push({
            name: biz.name,
            website: getDomain(biz.website),
            phone: biz.phone,
            email: "",
          });
        }
      } catch (err) {
        console.log(`❌ Failed to crawl ${biz.website}`);
        // push with empty email in case of error
        leads.push({
          name: biz.name,
          website: getDomain(biz.website),
          phone: biz.phone,
          email: "",
        });
      }
    }

    return c.json({
      leads: leads.map((l, index) => ({ ...l, id: index + 1 })),
    });
  } catch (error) {
    console.error("Error in scraper:", error);
    return c.json(
      { message: "Internal server error. Please try again later." },
      500
    );
  }
});

export default app;
