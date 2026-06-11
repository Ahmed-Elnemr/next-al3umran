"use client";

import { useLocale } from "next-intl";
import { Search, MapPin, Building2, WalletCards, SlidersHorizontal } from "lucide-react";

const PropertySearch = () => {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="relative -mt-6 z-20 pb-16 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="rounded-[34px] bg-white border border-[#E7E1D6] shadow-[0_24px_70px_rgba(16,24,32,0.12)] p-4 lg:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <button className="h-13 rounded-2xl bg-[#0E6B58] text-white font-black">
              {isAr ? "للبيع" : "For Sale"}
            </button>
            <button className="h-13 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] font-black">
              {isAr ? "للإيجار" : "For Rent"}
            </button>
            <button className="h-13 rounded-2xl bg-[#F6F4EE] text-[#101820] font-black">
              {isAr ? "مشاريع جديدة" : "New Projects"}
            </button>
            <button className="h-13 rounded-2xl bg-[#F6F4EE] text-[#101820] font-black">
              {isAr ? "أراضي" : "Lands"}
            </button>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_1fr_1fr_0.8fr_auto] gap-3">
            <SearchBox
              icon={<MapPin size={19} />}
              label={isAr ? "الموقع" : "Location"}
              placeholder={isAr ? "القاهرة الجديدة، الشيخ زايد..." : "New Cairo, Sheikh Zayed..."}
            />

            <SearchBox
              icon={<Building2 size={19} />}
              label={isAr ? "نوع العقار" : "Property Type"}
              placeholder={isAr ? "شقة، فيلا، أرض..." : "Apartment, Villa, Land..."}
            />

            <SearchBox
              icon={<WalletCards size={19} />}
              label={isAr ? "السعر" : "Budget"}
              placeholder={isAr ? "حدد الميزانية" : "Select Budget"}
            />

            <button className="h-[64px] rounded-2xl bg-[#F6F4EE] border border-[#E7E1D6] text-[#101820] flex items-center justify-center gap-2 font-black hover:border-[#0E6B58] transition">
              <SlidersHorizontal size={19} />
              {isAr ? "فلتر" : "Filter"}
            </button>

            <button className="h-[64px] rounded-2xl bg-[#101820] text-white px-7 flex items-center justify-center gap-2 font-black hover:bg-[#0E6B58] transition">
              <Search size={20} />
              {isAr ? "بحث" : "Search"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const SearchBox = ({
  icon,
  label,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
}) => {
  return (
    <label className="h-[64px] rounded-2xl bg-[#F7FAF8] border border-[#E1EAE6] px-4 flex flex-col justify-center hover:border-[#0E6B58]/50 transition">
      <span className="flex items-center gap-2 text-xs font-black text-[#0E6B58] mb-1">
        {icon}
        {label}
      </span>

      <input
        className="bg-transparent outline-none text-sm font-semibold text-[#101820] placeholder:text-[#A4B0AC]"
        placeholder={placeholder}
      />
    </label>
  );
};

export default PropertySearch;