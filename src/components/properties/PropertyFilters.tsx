"use client";

import {
  BedDouble,
  ChevronDown,
  CircleDollarSign,
  MapPin,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Tag,
  Home,
  Building2,
  ArrowUpDown,
} from "lucide-react";
import type { PropertyFiltersState } from "../../../app/[locale]/properties/page";

type Props = {
  isAr: boolean;
  filters: PropertyFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<PropertyFiltersState>>;
  resetFilters: () => void;
  countries: { value: string; label: string }[];
  cities: { value: string; label: string }[];
};

const PropertyFilters = ({
  isAr,
  filters,
  setFilters,
  resetFilters,
  countries,
  cities,
}: Props) => {
  const updateFilter = (key: keyof PropertyFiltersState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "country" ? { city: "all" } : {}),
    }));
  };

  return (
    <aside className="h-fit lg:sticky lg:top-24">
      <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/85 p-5 shadow-[0_25px_90px_rgba(16,24,32,0.12)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-24 end-[-70px] h-56 w-56 rounded-full bg-[#C89B3C]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 start-[-70px] h-64 w-64 rounded-full bg-[#0E6B58]/15 blur-3xl" />

        <div className="relative">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-black text-[#101820]">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#101820] text-white shadow-[0_14px_35px_rgba(16,24,32,0.18)]">
                  <SlidersHorizontal size={20} />
                </span>
                {isAr ? "فلترة العقارات" : "Property Filters"}
              </h2>

              <p className="mt-2 text-sm font-bold text-[#71807B]">
                {isAr ? "حدد المواصفات المطلوبة بدقة" : "Choose your exact preferences"}
              </p>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E2DBCE] bg-[#F8F6F1] text-[#101820] transition hover:-translate-y-1 hover:border-[#C89B3C] hover:bg-[#C89B3C]"
              aria-label="Reset filters"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <FilterInput
              icon={<Search size={18} />}
              label={isAr ? "بحث" : "Search"}
              value={filters.keyword}
              onChange={(value) => updateFilter("keyword", value)}
              placeholder={
                isAr
                  ? "ابحث بالمدينة، الدولة، الشركة..."
                  : "Search city, country, company..."
              }
              type="text"
            />

            <FilterSelect
              icon={<MapPin size={18} />}
              label={isAr ? "الدولة" : "Country"}
              value={filters.country}
              onChange={(value) => updateFilter("country", value)}
              options={[
                { value: "all", label: isAr ? "كل الدول" : "All Countries" },
                ...countries,
              ]}
            />

            <FilterSelect
              icon={<Building2 size={18} />}
              label={isAr ? "المدينة" : "City"}
              value={filters.city}
              onChange={(value) => updateFilter("city", value)}
              options={[
                { value: "all", label: isAr ? "كل المدن" : "All Cities" },
                ...cities,
              ]}
            />

            <FilterSelect
              icon={<Home size={18} />}
              label={isAr ? "نوع العقار" : "Property Type"}
              value={filters.type}
              onChange={(value) => updateFilter("type", value)}
              options={[
                { value: "all", label: isAr ? "كل الأنواع" : "All Types" },
                { value: "villa", label: isAr ? "فيلا" : "Villa" },
                { value: "house", label: isAr ? "بيت" : "House" },
                { value: "apartment", label: isAr ? "شقة" : "Apartment" },
                { value: "land", label: isAr ? "أرض" : "Land" },
                { value: "chalet", label: isAr ? "شاليه" : "Chalet" },
                { value: "office", label: isAr ? "مكتب" : "Office" },
              ]}
            />

            <FilterSelect
              icon={<Tag size={18} />}
              label={isAr ? "نوع الإعلان" : "Listing Type"}
              value={filters.status}
              onChange={(value) => updateFilter("status", value)}
              options={[
                { value: "all", label: isAr ? "بيع وإيجار" : "Sale & Rent" },
                { value: "sale", label: isAr ? "للبيع" : "For Sale" },
                { value: "rent", label: isAr ? "للإيجار" : "For Rent" },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <FilterInput
                icon={<CircleDollarSign size={18} />}
                label={isAr ? "أقل سعر" : "Min Price"}
                value={filters.minPrice}
                onChange={(value) => updateFilter("minPrice", value)}
                placeholder="0"
                type="number"
              />

              <FilterInput
                icon={<CircleDollarSign size={18} />}
                label={isAr ? "أعلى سعر" : "Max Price"}
                value={filters.maxPrice}
                onChange={(value) => updateFilter("maxPrice", value)}
                placeholder="999999"
                type="number"
              />
            </div>

            <FilterSelect
              icon={<BedDouble size={18} />}
              label={isAr ? "عدد الغرف" : "Bedrooms"}
              value={filters.minBeds}
              onChange={(value) => updateFilter("minBeds", value)}
              options={[
                { value: "all", label: isAr ? "أي عدد" : "Any" },
                { value: "1", label: isAr ? "غرفة فأكثر" : "1+ Bed" },
                { value: "2", label: isAr ? "غرفتين فأكثر" : "2+ Beds" },
                { value: "3", label: isAr ? "3 غرف فأكثر" : "3+ Beds" },
                { value: "4", label: isAr ? "4 غرف فأكثر" : "4+ Beds" },
                { value: "5", label: isAr ? "5 غرف فأكثر" : "5+ Beds" },
              ]}
            />

            <FilterSelect
              icon={<ArrowUpDown size={18} />}
              label={isAr ? "ترتيب النتائج" : "Sort Results"}
              value={filters.sort}
              onChange={(value) => updateFilter("sort", value)}
              options={[
                { value: "newest", label: isAr ? "الأحدث أولًا" : "Newest First" },
                {
                  value: "price-asc",
                  label: isAr ? "السعر من الأقل للأعلى" : "Price: Low to High",
                },
                {
                  value: "price-desc",
                  label: isAr ? "السعر من الأعلى للأقل" : "Price: High to Low",
                },
                {
                  value: "area-desc",
                  label: isAr
                    ? "المساحة من الأكبر للأصغر"
                    : "Area: Large to Small",
                },
                {
                  value: "area-asc",
                  label: isAr
                    ? "المساحة من الأصغر للأكبر"
                    : "Area: Small to Large",
                },
              ]}
            />

            <button
              type="button"
              onClick={resetFilters}
              className="mt-2 flex h-13 py-2 w-full items-center justify-center gap-2 rounded-2xl border border-[#D9D1C3] bg-[#101820] text-sm font-black text-white shadow-[0_14px_40px_rgba(16,24,32,0.18)] transition hover:-translate-y-1 hover:bg-[#0E6B58]"
            >
              <RotateCcw size={18} />
              {isAr ? "إعادة ضبط الفلترة" : "Reset Filters"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

const FilterSelect = ({
  icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) => {
  return (
    <label className="group block">
      <span className="mb-2 block text-sm font-black text-[#101820]">
        {label}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#F6F4EE] text-[#0E6B58] start-3 transition group-focus-within:bg-[#0E6B58] group-focus-within:text-white">
          {icon}
        </span>

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 w-full appearance-none rounded-[20px] border border-[#E2DBCE] bg-white px-14 text-sm font-black text-[#101820] outline-none shadow-[0_10px_28px_rgba(16,24,32,0.04)] transition focus:border-[#0E6B58] focus:bg-[#FBFCFA] focus:shadow-[0_14px_38px_rgba(14,107,88,0.10)]"
        >
          {options.map((option) => (
            <option key={`${label}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#71807B] end-4">
          <ChevronDown size={18} />
        </span>
      </div>
    </label>
  );
};

const FilterInput = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type: "text" | "number";
}) => {
  return (
    <label className="group block">
      <span className="mb-2 block text-sm font-black text-[#101820]">
        {label}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#F6F4EE] text-[#0E6B58] start-3 transition group-focus-within:bg-[#0E6B58] group-focus-within:text-white">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-[20px] border border-[#E2DBCE] bg-white px-14 text-sm font-black text-[#101820] outline-none shadow-[0_10px_28px_rgba(16,24,32,0.04)] transition placeholder:text-[#A2AEA9] focus:border-[#0E6B58] focus:bg-[#FBFCFA] focus:shadow-[0_14px_38px_rgba(14,107,88,0.10)]"
        />
      </div>
    </label>
  );
};

export default PropertyFilters;