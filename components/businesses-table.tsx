import { useBusinesses } from "@/app/_context/businesses-context";
import React from "react";
const Th = ({ children }: { children: React.ReactNode }) => {
  return (
    <th className="px-6 py-4 text-left font-medium text-gray-500 w-1/3">
      {children}
    </th>
  );
};

const Td = ({ children }: { children: React.ReactNode }) => {
  return (
    <td className="px-6 py-4 whitespace-nowrap text-gray-800">{children}</td>
  );
};

const BusinessesTable = () => {
  const { businesses } = useBusinesses();

  if (businesses.length === 0)
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-500">
        No businesses available.
      </div>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm w-[900px] mx-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50">
            <Th>Business Name</Th>
            <Th>Email</Th>
            <Th>Website</Th>
            <Th>Phone Number</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {businesses.map((business) => (
            <tr
              key={business.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <Td>{business.businessName}</Td>
              <Td>{business.email || "N/A"}</Td>
              <Td>{business.website}</Td>
              <Td>{business.phone || "N/A"}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessesTable;
