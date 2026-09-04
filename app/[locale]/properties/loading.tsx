import React from "react";
import PropertyCardSkeleton from "../../../src/components/shared/PropertyCardSkeleton";

export default function PropertiesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title Area Skeleton */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="w-1/4 h-8 bg-gray-200 animate-pulse rounded-md" />
        <div className="w-1/6 h-10 bg-gray-200 animate-pulse rounded-md" />
      </div>

      {/* Grid of 6 Properties */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
