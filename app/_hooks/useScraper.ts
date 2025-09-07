import { BusinessData, useBusinesses } from "../_context/businesses-context";
import toast from "react-hot-toast";
import { useRef } from "react";

const UseScraper = () => {
  const { setBusinesses, setIsPending, setProgress } = useBusinesses();
  const esRef = useRef<EventSource | null>(null); // store EventSource here

  const onScrape = async ({
    apiKey,
    searchQuery,
    pagesNumber,
    location,
  }: {
    apiKey: string;
    searchQuery: string;
    pagesNumber: number;
    location: string;
  }) => {
    setIsPending(true);
    setProgress(0);
    const businesses: BusinessData[] = [];

    return new Promise<void>((resolve, reject) => {
      esRef.current = new EventSource(
        `/api/scraper?apiKey=${apiKey}&searchQuery=${encodeURIComponent(
          searchQuery
        )}&pagesNumber=${pagesNumber}&location=${encodeURIComponent(location)}`
      );

      const es = esRef.current;

      es.addEventListener("progress", (e: { data: string }) => {
        const { status, percent } = JSON.parse(e.data);
        console.log("Progress:", status, percent + "%");
        setProgress(percent);
      });

      es.addEventListener("lead", (e: { data: string }) => {
        const leads = JSON.parse(e.data);
        businesses.push(...leads);
        setBusinesses([...businesses]);
      });

      es.addEventListener("done", () => {
        setIsPending(false);
        setProgress(100);
        toast.success("Scraping completed successfully!");
        es.close();
        esRef.current = null;
        resolve();
      });

      es.addEventListener("error", (e: Event) => {
        setIsPending(false);
        console.error("Scraping error:", e);
        toast.error("An error occurred during scraping.");
        es.close();
        esRef.current = null;
        reject(e);
      });
    });
  };

  const stopScrape = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
      setIsPending(false);
      toast("Scraping stopped.");
    }
  };

  return { onScrape, stopScrape };
};

export default UseScraper;
