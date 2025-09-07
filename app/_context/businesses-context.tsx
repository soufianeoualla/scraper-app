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

  return (
    <BusinessesContext.Provider
      value={{ businesses, setBusinesses, isPending, setIsPending }}
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
