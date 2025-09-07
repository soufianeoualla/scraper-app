import { useBusinesses } from "@/app/_context/businesses-context";
import React, { useState } from "react";
import Pagination from "./pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = businesses?.slice(firstItemIndex, lastItemIndex);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(businesses?.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  const lastPage = pageNumbers.length;
  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm h-[585px] w-[1280px] ">
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
            {currentItems.map((business) => (
              <tr
                key={business.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <Td>{business.name}</Td>
                <Td>{business.email || "N/A"}</Td>
                <Td>{business.website}</Td>
                <Td>{business.phone || "N/A"}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {businesses.length > itemsPerPage && (
        <Pagination
          resultsPerPage={itemsPerPage}
          totalResults={businesses.length}
          currentPage={currentPage}
          lastPage={lastPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};

export default BusinessesTable;
