"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";

const LanguageSelector: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isArabic = pathname.startsWith("/ar");
  const newLocale = isArabic ? "en" : "ar";

  const toggleLanguage = (e: React.MouseEvent) => {
    e.preventDefault();

    const pathWithoutLocale = pathname.replace(/^\/(ar|en)/, "");
    const queryString = searchParams.toString();
    const queryPart = queryString ? `?${queryString}` : "";

    window.location.href = `/${newLocale}${pathWithoutLocale}${queryPart}`;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="h-[48px] rounded-full bg-[#F4F8F6] border border-[#E3ECE8] text-[#101820] px-4 flex items-center justify-center gap-2 text-sm font-black hover:bg-[#0E6B58] hover:text-white transition"
      type="button"
    >
      <Languages size={18} />
      <span>{isArabic ? "EN" : "AR"}</span>
    </button>
  );
};

export default LanguageSelector;