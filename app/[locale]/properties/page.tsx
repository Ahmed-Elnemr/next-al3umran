"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Home } from "lucide-react";
import PropertyFilters from "../../../src/components/properties/PropertyFilters";
import PropertiesList from "../../../src/components/properties/PropertiesList";
import { getProperties, mapApiProperty } from "../../../src/lib/api/client";

export type PropertyType =
  | "villa"
  | "house"
  | "apartment"
  | "land"
  | "chalet"
  | "office";

export type PropertyStatus = "sale" | "rent";

export type PropertyItem = {
  id: number;
  image: string;
  titleAr: string;
  titleEn: string;
  countryAr: string;
  countryEn: string;
  cityAr: string;
  cityEn: string;
  locationAr: string;
  locationEn: string;
  price: number;
  currencyAr: string;
  currencyEn: string;
  status: PropertyStatus;
  type: PropertyType;
  companyAr: string;
  companyEn: string;
  beds: number;
  baths: number;
  area: number;
  createdAt: string;
};

export type PropertyFiltersState = {
  keyword: string;
  country: string;
  city: string;
  type: string;
  status: string;
  priceRange: string;
  minBeds: string;
  sort: string;
};

const PropertiesPage = () => {
  const params = useParams();
  const locale = String(params?.locale || "ar");
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [filters, setFilters] = useState<PropertyFiltersState>({
    keyword: "",
    country: "all",
    city: "all",
    type: "all",
    status: "all",
    priceRange: "all",
    minBeds: "all",
    sort: "newest",
  });

  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.keyword.trim()) query.set("keyword", filters.keyword.trim());
    if (filters.status !== "all") query.set("listing_type", filters.status);
    if (filters.minBeds !== "all") query.set("min_beds", filters.minBeds);
    if (filters.sort) query.set("sort", filters.sort);
    query.set("per_page", "50");
    setLoading(true);
    getProperties(locale, query.toString())
      .then((res) => {
        const rows = res?.data?.data || res?.data || [];
        const list = Array.isArray(rows) ? rows : [];
        setProperties(list.map((item: any) => mapApiProperty(item, locale)));
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [locale, filters.keyword, filters.status, filters.minBeds, filters.sort]);

  const countries = useMemo(() => {
    const map = new Map<string, string>();
    properties.forEach((item) => {
      map.set(item.countryEn, isAr ? item.countryAr : item.countryEn);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [isAr, properties]);

  const cities = useMemo(() => {
    const filtered =
      filters.country === "all"
        ? properties
        : properties.filter((item) => item.countryEn === filters.country);

    const map = new Map<string, string>();
    filtered.forEach((item) => {
      map.set(item.cityEn, isAr ? item.cityAr : item.cityEn);
    });

    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [filters.country, isAr, properties]);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (filters.keyword.trim()) {
      const keyword = filters.keyword.trim().toLowerCase();

      result = result.filter((item) => {
        const text = [
          item.titleAr,
          item.titleEn,
          item.countryAr,
          item.countryEn,
          item.cityAr,
          item.cityEn,
          item.locationAr,
          item.locationEn,
          item.companyAr,
          item.companyEn,
        ]
          .join(" ")
          .toLowerCase();

        return text.includes(keyword);
      });
    }

    if (filters.country !== "all") {
      result = result.filter((item) => item.countryEn === filters.country);
    }

    if (filters.city !== "all") {
      result = result.filter((item) => item.cityEn === filters.city);
    }

    if (filters.type !== "all") {
      result = result.filter((item) => item.type === filters.type);
    }

    if (filters.status !== "all") {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.minBeds !== "all") {
      result = result.filter((item) => item.beds >= Number(filters.minBeds));
    }

    if (filters.priceRange && filters.priceRange !== "all") {
      const [minStr, maxStr] = filters.priceRange.split("-");
      const min = minStr ? Number(minStr) : 0;
      if (maxStr) {
        const max = Number(maxStr);
        result = result.filter((item) => item.price >= min && item.price <= max);
      } else {
        result = result.filter((item) => item.price >= min);
      }
    }

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "area-desc":
        result.sort((a, b) => b.area - a.area);
        break;
      case "area-asc":
        result.sort((a, b) => a.area - b.area);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [filters, properties]);

  const resetFilters = () => {
    setFilters({
      keyword: "",
      country: "all",
      city: "all",
      type: "all",
      status: "all",
      priceRange: "all",
      minBeds: "all",
      sort: "newest",
    });
  };

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#EEF2EC] pt-6 pb-16"
    >
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,60,0.25),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,107,88,0.2),transparent_36%)]" />
        <div className="absolute inset-0 opacity-[0.23] bg-[linear-gradient(rgba(16,24,32,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,24,32,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <Link
            href={`/${locale}`}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#101820] shadow-sm transition hover:bg-[#101820] hover:text-white"
          >
            <BackIcon size={18} />
            {isAr ? "العودة للرئيسية" : "Back Home"}
          </Link>

          <div className="mb-8 rounded-[38px] border border-white/70 bg-white/65 p-6 shadow-[0_30px_100px_rgba(16,24,32,0.10)] backdrop-blur-xl md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#0E6B58]/10 px-4 py-2 text-sm font-black text-[#0E6B58]">
                  <Home size={16} />
                  {isAr ? "كل العقارات" : "All Properties"}
                </span>

                <h1 className="max-w-4xl text-3xl font-black leading-[1.25] tracking-[-0.03em] text-[#101820] md:text-5xl">
                  {isAr
                    ? "ابحث عن العقار المناسب في سوريا والعراق والإمارات"
                    : "Find the right property in Syria, Iraq and the UAE"}
                </h1>

                <p className="mt-4 max-w-3xl text-base leading-8 text-[#5E6D68]">
                  {isAr
                    ? "فلترة كاملة حسب الدولة، المدينة، نوع العقار، السعر، نوع الإعلان، المساحة والغرف."
                    : "Advanced filtering by country, city, property type, price, listing type, area and bedrooms."}
                </p>
              </div>

              <div className="rounded-3xl bg-[#101820] px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C89B3C] text-[#101820]">
                    <Building2 size={24} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white/55">
                      {isAr ? "عدد النتائج" : "Results"}
                    </p>
                    <h2 className="text-3xl font-black">
                      {filteredProperties.length}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-7">
            <PropertyFilters
              isAr={isAr}
              filters={filters}
              setFilters={setFilters}
              resetFilters={resetFilters}
              countries={countries}
              cities={cities}
            />

            <PropertiesList
              isAr={isAr}
              locale={locale}
              properties={filteredProperties}
              resetFilters={resetFilters}
              loading={loading}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PropertiesPage;