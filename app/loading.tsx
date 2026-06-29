"use client";

export default function Loading() {
  const isAr = true; // Fallback since this is root loading

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F6F4EE]">
      <div className="relative flex flex-col items-center gap-6">
        {/* Main Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 rounded-full border-4 border-[#E7E1D6]"></div>
          
          {/* Animated spinner */}
          <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-t-[#0E6B58] border-r-[#C89B3C] border-b-transparent border-l-transparent animate-spin"></div>
          
          {/* Inner dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0E6B58]/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#0E6B58] animate-pulse"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg font-black text-[#101820] tracking-wide">
            {isAr ? "جاري التحميل..." : "Loading..."}
          </p>
          
          {/* Animated dots */}
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0E6B58] animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-2 h-2 rounded-full bg-[#0E6B58] animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-2 h-2 rounded-full bg-[#0E6B58] animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>

        {/* Decorative blur effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#0E6B58]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#C89B3C]/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}