import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

const Checkbox = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: () => void;
}) => {
  return (
    <div
      onClick={onChange}
      className={cn(
        "w-4 h-4 rounded border text-white border-indigo-200 cursor-pointer flex items-center justify-center z-50",
        isChecked && "bg-primary border-primary"
      )}
    >
      {isChecked && <Check  />}
    </div>
  );
};

export default Checkbox;