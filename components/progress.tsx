import React from "react";

const Progress = ({
  text,
  progress = 50,
  onCancel,
}: {
  text: string;
  progress: number;
  onCancel: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-1 bg-white shadow-sm  border border-gray-200 rounded-2xl w-[600px] py-8 ">
      <div className="w-[200px] h-[200px] flex flex-col items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#e5e7eb" // Tailwind gray-200
            strokeWidth="10"
            fill="none"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#A453F5" // Tailwind blue-500
            strokeWidth="10"
            fill="none"
            strokeDasharray={565.48} // 2 * π * r
            strokeDashoffset={565.48 - (progress / 100) * 565.48} // dynamic progress
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        </svg>
        {/* Percentage Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">{progress}%</h1>
        </div>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mt-8">Fetching Data </h1>{" "}
      <p className="text-gray-600 mt-2">
        {" "}
        Fetching businesses for{" "}
        <span className="font-semibold text-gray-800">{text}</span>{" "}
      </p>
      <button
        onClick={onCancel}
        className="mt-10 w-1/2 py-2 border border-primary-300/50 text-gray-900 rounded-2xl hover:bg-primary-100/20 hover: transition-colors"
      >
        Cancel
      </button>
    </div>
  );
};

export default Progress;
