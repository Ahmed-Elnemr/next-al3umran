"use client";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";

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
    <aside className="w-full relative z-20">
      <div className="relative rounded-[34px] border border-white/80 bg-white/85 p-5 shadow-[0_25px_90px_rgba(16,24,32,0.12)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[34px]">
          <div className="absolute -top-24 end-[-70px] h-56 w-56 rounded-full bg-[#C89B3C]/20 blur-3xl" />
          <div className="absolute -bottom-24 start-[-70px] h-64 w-64 rounded-full bg-[#0E6B58]/15 blur-3xl" />
        </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
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

            <FilterSelect
              icon={<CircleDollarSign size={18} />}
              label={isAr ? "السعر" : "Price"}
              value={filters.priceRange || "all"}
              onChange={(value) => updateFilter("priceRange", value)}
              options={[
                { value: "all", label: isAr ? "كل الأسعار" : "All Prices" },
                { value: "0-100000", label: isAr ? "أقل من 100,000" : "Under 100,000" },
                { value: "100000-500000", label: "100,000 - 500,000" },
                { value: "500000-1000000", label: "500,000 - 1,000,000" },
                { value: "1000000-5000000", label: "1,000,000 - 5,000,000" },
                { value: "5000000-", label: isAr ? "أكثر من 5,000,000" : "5,000,000+" },
              ]}
            />

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
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-[#D9D1C3] bg-[#101820] text-sm font-black text-white shadow-[0_14px_40px_rgba(16,24,32,0.18)] transition hover:-translate-y-1 hover:bg-[#0E6B58]"
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const isAr = String(params?.locale || "ar") === "ar";

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="group block relative" ref={dropdownRef}>
      <span className="mb-2 block text-sm font-black text-[#101820]">
        {label}
      </span>

      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#F6F4EE] text-[#0E6B58] start-3 transition group-hover:bg-[#0E6B58] group-hover:text-white">
          {icon}
        </span>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-full items-center justify-between rounded-[20px] border border-[#E2DBCE] bg-white ps-14 pe-4 text-sm font-black text-[#101820] shadow-[0_10px_28px_rgba(16,24,32,0.04)] transition hover:border-[#0E6B58] hover:shadow-[0_14px_38px_rgba(14,107,88,0.10)] focus:border-[#0E6B58] focus:outline-none"
        >
          <span className="truncate">{selectedOption?.label}</span>
          <ChevronDown
            size={18}
            className={`text-[#71807B] transition-transform duration-300 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 w-full origin-top rounded-[20px] border border-[#E2DBCE] bg-white p-2 shadow-[0_20px_60px_rgba(16,24,32,0.15)] animate-in fade-in zoom-in-95">
            <div className={`${options.length > 10 ? "max-h-[400px] overflow-y-auto" : ""} pr-1`}>
              {options.map((option) => (
                <button
                  key={`${label}-${option.value}`}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full rounded-xl px-4 py-3 ${isAr ? "text-right" : "text-left"} text-sm font-bold transition-colors ${value === option.value
                      ? "bg-[#0E6B58] text-white"
                      : "text-[#101820] hover:bg-[#F6F4EE]"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
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
          className="h-14 w-full rounded-[20px] border border-[#E2DBCE] bg-white ps-14 pe-4 text-sm font-black text-[#101820] outline-none shadow-[0_10px_28px_rgba(16,24,32,0.04)] transition placeholder:text-[#A2AEA9] focus:border-[#0E6B58] focus:bg-[#FBFCFA] focus:shadow-[0_14px_38px_rgba(14,107,88,0.10)]"
        />
      </div>
    </label>
  );
};

export default PropertyFilters;