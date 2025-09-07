import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UseScraper from "@/app/_hooks/useScraper";
import schema from "@/schema";
import { useBusinesses } from "@/app/_context/businesses-context";

type FormData = z.infer<typeof schema>;

const FetchBusinesses = () => {
  const { onScrape } = UseScraper();
  const { isPending } = useBusinesses();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      apiKey: "",
      searchQuery: "",
      pagesNumber: undefined,
      location: "",
    },
  });

  const onSubmit = (data: FormData) => {
    onScrape({
      apiKey: data.apiKey,
      searchQuery: data.searchQuery,
      pagesNumber: data.pagesNumber,
      location: data.location,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10 flex flex-col items-center mb-20"
    >
      <div className="grid grid-cols-4  gap-x-10 w-full">
        {/* API Key */}
        <div>
          <Label htmlFor="apiKey">SERPAPI Key</Label>
          <Controller
            name="apiKey"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                disabled={isPending}
                id="apiKey"
                placeholder="Enter your API key"
                className="w-72"
              />
            )}
          />
          {errors.apiKey && (
            <p className="text-red-500 text-xs  mt-2 font-medium">
              {" "}
              * {errors.apiKey.message}
            </p>
          )}
        </div>

        {/* Search Query */}
        <div>
          <Label htmlFor="searchQuery">Search Query</Label>
          <Controller
            name="searchQuery"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                disabled={isPending}
                id="searchQuery"
                placeholder='e.g., "Coffee shops in New York"'
                className="w-72"
              />
            )}
          />
          {errors.searchQuery && (
            <p className="text-red-500 text-xs  mt-2 font-medium">
              * {errors.searchQuery.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                disabled={isPending}
                id="location"
                placeholder="[[40.0616373,-85.9393935],[39.8840369,-86.26368029999999]]"
                className="w-72"
              />
            )}
          />
          {errors.location && (
            <p className="text-red-500 text-xs  mt-2 font-medium">
              {" "}
              * {errors.location.message}
            </p>
          )}
        </div>

        {/* Number of Pages */}
        <div>
          <Label htmlFor="pagesNumber">Number of Pages to Fetch</Label>
          <Controller
            name="pagesNumber"
            control={control}
            render={({ field }) => (
              <Input
                disabled={isPending}
                onChange={(e) => field.onChange(Number(e.target.value))}
                type="number"
                value={field.value || ""}
                id="pagesNumber"
                placeholder="e.g., 5"
                className="w-72"
              />
            )}
          />
          {errors.pagesNumber && (
            <p className="text-red-500 text-xs  mt-2 font-medium">
              * {errors.pagesNumber.message}
            </p>
          )}
        </div>
      </div>

      <button
        disabled={!!Object.keys(errors).length || isPending}
        type="submit"
        className="flex justify-center items-center h-12 px-8 rounded-2xl shadow-sm font-bold text-white bg-primary hover:bg-primary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Fetching..." : "Fetch Businesses"}
      </button>
    </form>
  );
};

export default FetchBusinesses;
