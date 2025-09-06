import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border border-slate-200 flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[rgb(164,83,245)]  bg-gray-50 h-12 placeholder:text-gray-400 p-4 text-sm font-normal leading-normal disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export { Input };
