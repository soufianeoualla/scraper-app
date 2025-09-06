import api from "@/config/axios-instance";
import toast from "react-hot-toast";
import { useBusinesses } from "../_context/businesses-context";
import { useState } from "react";

const UseScraper = () => {
  const { setBusinesses, setIsPending } = useBusinesses();

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
    try {
      const response = await api.post("/scraper", {
        apiKey,
        searchQuery,
        pagesNumber,
        location,
      });

      toast.success("Scraping completed successfully!");
      setIsPending(false);
      return setBusinesses(response.data);
    } catch (error) {
      setIsPending(false);
      console.error("Error during scraping:", error);
      toast.error(
        "An error occurred during scraping. Check your API key and try again."
      );
      throw error;
    }
  };
  return { onScrape };
};

export default UseScraper;
