import React from "react";
import { Skeleton } from "../../../../src/components/ui/skeleton";

export default function PropertyDetailsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb Area */}
      <Skeleton className="w-1/3 h-4 mb-6" />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Images & Description) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Hero Image */}
          <Skeleton className="w-full aspect-video rounded-2xl" />
          
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square rounded-xl" />
            ))}
          </div>

          {/* Details Section */}
          <div className="space-y-4 pt-6 border-t border-gray-100">
            <Skeleton className="w-1/4 h-8" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
          </div>
        </div>

        {/* Right Column (Sidebar / Price Card) */}
        <div className="lg:col-span-1">
          <div className="border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6 bg-white sticky top-24">
            <Skeleton className="w-1/2 h-10" />
            
            <div className="space-y-4">
              <Skeleton className="w-full h-12 rounded-xl" />
              <Skeleton className="w-full h-12 rounded-xl" />
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-4">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
