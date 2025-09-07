"use client";

import React, { createContext, useContext, useState } from "react";

export interface BusinessData {
  id: number;
  name: string;
  email: string;
  website: string;
  phone?: string;
}

interface BusinessesContextType {
  businesses: BusinessData[];
  setBusinesses: React.Dispatch<React.SetStateAction<BusinessData[]>>;
  isPending: boolean;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;

}

const BusinessesContext = createContext<BusinessesContextType | undefined>(
  undefined
);

export const BusinessesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [businesses, setBusinesses] = useState<BusinessData[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [query, setQuery] = useState('');

  return (
    <BusinessesContext.Provider
      value={{
        businesses,
        setBusinesses,
        isPending,
        setIsPending,
        progress,
        setProgress,
        query,
        setQuery,
      }}
    >
      {children}
    </BusinessesContext.Provider>
  );
};

export const useBusinesses = () => {
  const context = useContext(BusinessesContext);
  if (!context) {
    throw new Error("useBusinesses must be used within a BusinessesProvider");
  }
  return context;
};
