"use client";

import BusinessesTable from "@/components/businesses-table";
import FetchBusinesses from "@/components/fetch-businesses";
import Checkbox from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/modal";
import { Download } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { BusinessData, useBusinesses } from "./_context/businesses-context";

const availableColumns = [
  { key: "businessName", label: "Business Name" },
  { key: "email", label: "Email" },
  { key: "website", label: "Website" },
  { key: "phone", label: "Phone Number" },
];

export default function Home() {
  const { businesses } = useBusinesses();
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "businessName",
    "email",
    "website",
  ]);
  const [showModal, setShowModal] = useState(false);

  const handleColumnToggle = (columnKey: string) => {
    setSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((col) => col !== columnKey)
        : [...prev, columnKey]
    );
  };
  const handleExportData = () => {
    if (selectedColumns.length === 0) {
      toast.error("Please select at least one column to export.");
      return;
    }

    const exportData = businesses.map((business) => {
      const filteredBusiness: Partial<
        Record<keyof BusinessData, string | number | null>
      > = {};
      selectedColumns.forEach((col) => {
        filteredBusiness[col as keyof BusinessData] =
          business[col as keyof BusinessData];
      });
      return filteredBusiness;
    });

    const headers = selectedColumns
      .map((col) => availableColumns.find((c) => c.key === col)?.label || col)
      .join(",");

    const csvContent = [
      headers,
      ...exportData.map((row) =>
        selectedColumns
          .map((col) => `"${row[col as keyof typeof row] || ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-data.csv";
    a.click();
    URL.revokeObjectURL(url);

    setShowModal(false);
    toast.success("Data exported successfully!");
  };

  console.log("businesses", businesses);

  return (
    <div className="flex flex-col items-center justify-center pt-20 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Google Maps Data Extractor
      </h1>
      <p className="text-gray-500 mb-12">
        Enter your details below to start extracting business data.
      </p>

      <FetchBusinesses />

      {businesses.length > 0 && (
        <>
          <BusinessesTable />

          <div className=" my-20">
            <button
              onClick={() => setShowModal(true)}
              type="submit"
              className=" flex justify-center items-center h-10 px-6 rounded-2xl text-sm shadow-sm font-bold text-white bg-primary hover:bg-primary/70 transition-colors"
            >
              Export Data
            </button>
          </div>
        </>
      )}

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl p-6 w-[400px]  space-y-6">
          <div>
            <h1 className="text-xl text-gray-800 font-medium">
              Export Configuration
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Select columns and format for your export
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">
                Select Columns to Export
              </h4>
              <div className="space-y-4">
                {availableColumns.map((column) => (
                  <div key={column.key} className="flex items-center  gap-x-2">
                    <Checkbox
                      isChecked={selectedColumns.includes(column.key)}
                      onChange={() => handleColumnToggle(column.key)}
                    />
                    <Label htmlFor={column.key} className="m-0">
                      {column.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex  justify-center items-center pt-4 gap-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 flex gap-2 items-center justify-center border-primary/50 border px-6 h-10 text-gray-900 rounded-2xl font-semibold text-sm hover:bg-gray-50 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExportData}
                className="flex-1 flex gap-2 items-center justify-center bg-primary px-6 h-10 text-white rounded-2xl font-semibold text-sm hover:bg-primary/80 transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
