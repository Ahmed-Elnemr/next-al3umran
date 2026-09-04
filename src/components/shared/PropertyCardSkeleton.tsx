import React from "react";
import { Skeleton } from "../ui/Skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 border border-gray-100 rounded-2xl shadow-sm bg-white">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-[200px] rounded-xl" />

      {/* Content Skeleton */}
      <div className="flex flex-col gap-3 mt-2">
        {/* Title */}
        <Skeleton className="w-3/4 h-6" />
        {/* Location / Subtitle */}
        <Skeleton className="w-1/2 h-4" />
        
        {/* Features Row */}
        <div className="flex items-center gap-4 mt-2">
          <Skeleton className="w-12 h-4" />
          <Skeleton className="w-12 h-4" />
          <Skeleton className="w-12 h-4" />
        </div>

        <div className="border-t border-gray-100 my-2"></div>

        {/* Footer (Price & Action) */}
        <div className="flex justify-between items-center">
          <Skeleton className="w-1/3 h-6" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
