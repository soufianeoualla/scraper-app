import React, { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  lastPage: number;
  totalResults: number;
  resultsPerPage: number;
};

const Pagination = ({
  setCurrentPage,
  currentPage,
  lastPage,
  totalResults,
  resultsPerPage,
}: Props) => {
  const navigate = (direction: "prev" | "next" | number) => {
    if (typeof direction === "number") {
      setCurrentPage(direction);
      return;
    }

    setCurrentPage((prev) => {
      if (direction === "prev" && prev > 1) return prev - 1;
      if (direction === "next" && prev < lastPage) return prev + 1;
      return prev;
    });
  };

  const pageButtonClass =
    "h-10 w-10 rounded-2xl flex items-center justify-center";
  const navButtonClass =
    "flex justify-center items-center gap-2 py-2 px-4 bg-gray-50 rounded-2xl";

  const renderPageButton = (page: number, isActive = false) => (
    <button
      key={page}
      className={`${pageButtonClass} ${
        isActive
          ? "bg-primary text-white font-bold"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
      onClick={() => !isActive && navigate(page)}
      aria-label={`Page ${page}`}
      aria-current={isActive ? "page" : undefined}
    >
      {page}
    </button>
  );

  const showEllipsis = currentPage + 2 < lastPage;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === lastPage;

  // Calculate the range of results being shown
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex  justify-between w-full gap-y-8 items-center text-base mt-10">
      {/* Pagination Controls */}
      <div className="text-gray-600 font-semibold">
        Showing {startResult} to {endResult} of {totalResults} results
      </div>
      <div className="flex items-center gap-x-4">
        {/* Previous Button */}
        <button
          disabled={isFirstPage}
          onClick={() => navigate("prev")}
          aria-label="Previous Page"
          className={`${navButtonClass} ${
            isFirstPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          <ChevronLeft strokeWidth={1.5} className="w-5 h-5" />
          Previous
        </button>

        {/* Page Numbers */}
        {currentPage > 1 && renderPageButton(currentPage - 1)}
        {renderPageButton(currentPage, true)}
        {currentPage < lastPage && renderPageButton(currentPage + 1)}
        {currentPage + 1 < lastPage && renderPageButton(currentPage + 2)}

        {/* Ellipsis */}
        {showEllipsis && (
          <span className="px-2 text-gray-400" aria-hidden="true">
            ...
          </span>
        )}

        {/* Next Button */}
        <button
          disabled={isLastPage}
          onClick={() => navigate("next")}
          aria-label="Next Page"
          className={`${navButtonClass} ${
            isLastPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
          }`}
        >
          Next
          <ChevronRight strokeWidth={1.5} className="w-5 h-5" />
        </button>
      </div>
     
    </div>
  );
};

export default Pagination;
