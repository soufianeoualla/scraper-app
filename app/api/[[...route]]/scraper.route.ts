import { zValidator } from "@hono/zod-validator";
import axios from "axios";
import { Hono } from "hono";
import * as cheerio from "cheerio";
import { streamSSE } from "hono/streaming";
import schema from "@/schema";

function getDomain(url: string) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getGoogleMapsMidpointFromString(bboxStr: string): string {
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

  const blacklist = [
    /^example@/i,
    /^user@/i,
    /^name@mail\.com$/i,
    /^info@example\.com$/i,
    /@example\.com$/i,
    /@mysite\.com$/i,
    /@domain\.com$/i,
    /@.*sentry.*\./i,
    /@.*sg-host\.com$/i,
    /\.(jpg|jpeg|png|gif|webp)$/i,
    /@\d+(\.\d+)?x/i,
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
      extractEmails(html).forEach((e) => emails.add(e));

      const $ = cheerio.load(html);
      $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        if (!href) return;

        let fullUrl;
        try {
          fullUrl = new URL(href, base).href;
        } catch {
          return;
        }

        if (fullUrl.startsWith(base) && !visited.has(fullUrl)) {
          toVisit.push(fullUrl);
        }
      });
    } catch {
      // ignore errors
    }
  }

  return {
    emails: Array.from(emails),
  };
}

const app = new Hono().get("/", zValidator("query", schema), async (c) => {
  const { searchQuery, pagesNumber, location } = c.req.valid("query");
  const apiKey = process.env.SERPAPI_KEY!;
  const ll = getGoogleMapsMidpointFromString(location);

  return streamSSE(c, async (stream) => {
    try {
      const results = await searchGoogleMaps({
        apiKey,
        searchQuery,
        pagesNumber,
        ll,
      });

      let id = 1;

      for (let i = 0; i < results.length; i++) {
        const biz = results[i];
        const percent = Math.round(((i + 1) / results.length) * 100);

        await stream.writeSSE({
          event: "progress",
          data: JSON.stringify({
            status: `Crawling ${biz.website}`,
            percent,
          }),
        });
        try {
          const { emails } = await crawlWebsite(biz.website);
          const leads = [
            {
              id: id++,
              name: biz.name,
              website: getDomain(biz.website),
              phone: biz.phone,
              email: emails.join(", "),
            },
          ];

          await stream.writeSSE({
            event: "lead",
            data: JSON.stringify(leads),
          });
        } catch {
          await stream.writeSSE({
            event: "error",
            data: JSON.stringify({ website: biz.website }),
          });
        }
      }

      await stream.writeSSE({ event: "done", data: "Scraping finished" });
    } catch (err) {
      await stream.writeSSE({
        event: "error",
        data: JSON.stringify({ message: "Fatal error" }),
      });
    }
  });
});

export default app;
