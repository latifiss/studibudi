"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value?: number;
  className?: string;
}

export default function Progress({
  value = 0,
  className,
}: ProgressProps) {
  const progress = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-[#E5E5E5]",
        className
      )}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="relative h-full rounded-full bg-[#22C55E] transition-[width] duration-300 ease-out"
        style={{
          width: `${progress}%`,
        }}
      >
        {/* Subtle white overlay bar */}
        <div className="absolute inset-0 rounded-full">
          <div className="h-[4.8px] w-full bg-white/20 rounded-full mt-1" />
        </div>
      </div>
    </div>
  );
}