"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Home } from "lucide-react";
import PropertyFilters from "../../../src/components/properties/PropertyFilters";
import PropertiesList from "../../../src/components/properties/PropertiesList";
import {
  getCategories,
  getCities,
  getCountries,
  getProperties,
  mapApiProperty,
  envelopeList,
} from "../../../src/lib/api/client";

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
  gallery?: string[];
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
  companyId?: string;
  companyAr: string;
  companyEn: string;
  companyLogo?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  beds: number;
  baths: number;
  area: number;
  createdAt: string;
  descriptionAr?: string;
  descriptionEn?: string;
  category?: string;
  categoryId?: number;
  features?: string[];
};

export type PropertyFiltersState = {
  keyword: string;
  country_id: string;
  city_id: string;
  category_id: string;
  listing_type: string;
  priceRange: string;
  minBeds: string;
  sort: string;
  page: number;
  per_page: number;
};

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
};

const PropertiesPage = () => {
  const params = useParams();
  const locale = String(params?.locale || "ar");
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const [filters, setFilters] = useState<PropertyFiltersState>({
    keyword: "",
    country_id: "all",
    city_id: "all",
    category_id: "all",
    listing_type: "all",
    priceRange: "all",
    minBeds: "all",
    sort: "newest",
    page: 1,
    per_page: 12,
  });

  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 12,
  });
  const [loading, setLoading] = useState(true);

  // Dynamic filter options fetched from API
  const [countriesOptions, setCountriesOptions] = useState<{ value: string; label: string }[]>([]);
  const [citiesOptions, setCitiesOptions] = useState<{ value: string; label: string }[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<{ value: string; label: string }[]>([]);

  // Fetch Countries & Categories on mount
  useEffect(() => {
    getCountries(locale)
      .then((res) => {
        const list = envelopeList(res);
        if (list && list.length > 0) {
          setCountriesOptions(
            list.map((c: any) => ({
              value: String(c.id),
              label: c.name || c.title || c.code,
            }))
          );
        }
      })
      .catch(() => {});

    getCategories(locale)
      .then((res) => {
        const list = envelopeList(res);
        if (list && list.length > 0) {
          setCategoriesOptions(
            list.map((cat: any) => ({
              value: String(cat.id),
              label: cat.name || cat.title,
            }))
          );
        }
      })
      .catch(() => {});
  }, [locale]);

  // Fetch Cities whenever selected country_id changes
  useEffect(() => {
    const countryId = filters.country_id !== "all" ? filters.country_id : undefined;
    getCities(locale, countryId)
      .then((res) => {
        const list = envelopeList(res);
        if (list) {
          setCitiesOptions(
            list.map((c: any) => ({
              value: String(c.id),
              label: c.name || c.title,
            }))
          );
        }
      })
      .catch(() => setCitiesOptions([]));
  }, [locale, filters.country_id]);

  // Main properties API fetch call to client/properties
  useEffect(() => {
    const query = new URLSearchParams();

    if (filters.country_id !== "all") query.set("country_id", filters.country_id);
    if (filters.city_id !== "all") query.set("city_id", filters.city_id);
    if (filters.category_id !== "all") query.set("category_id", filters.category_id);
    if (filters.listing_type !== "all") query.set("listing_type", filters.listing_type);
    if (filters.sort) query.set("sort", filters.sort);
    if (filters.keyword.trim()) query.set("keyword", filters.keyword.trim());
    query.set("page", String(filters.page || 1));
    query.set("per_page", String(filters.per_page || 12));

    setLoading(true);
    getProperties(locale, query.toString())
      .then((res) => {
        const rows = res?.data?.data || res?.data?.properties || res?.data || res?.properties || [];
        const list = Array.isArray(rows) ? rows : [];
        setProperties(list.map((item: any) => mapApiProperty(item, locale)).filter(Boolean));

        const metaData = res?.data?.meta || res?.meta;
        if (metaData) {
          setMeta({
            currentPage: Number(metaData.current_page || filters.page || 1),
            lastPage: Number(metaData.last_page || 1),
            total: Number(metaData.total || list.length),
            perPage: Number(metaData.per_page || filters.per_page || 12),
          });
        } else {
          setMeta({
            currentPage: filters.page || 1,
            lastPage: 1,
            total: list.length,
            perPage: filters.per_page || 12,
          });
        }
      })
      .catch(() => {
        setProperties([]);
        setMeta({ currentPage: 1, lastPage: 1, total: 0, perPage: 12 });
      })
      .finally(() => setLoading(false));
  }, [
    locale,
    filters.country_id,
    filters.city_id,
    filters.category_id,
    filters.listing_type,
    filters.sort,
    filters.keyword,
    filters.page,
    filters.per_page,
  ]);

  // Client-side additional filtering for priceRange and minBeds if needed
  const filteredProperties = useMemo(() => {
    let result = [...properties];

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

    return result;
  }, [filters.minBeds, filters.priceRange, properties]);

  const resetFilters = () => {
    setFilters({
      keyword: "",
      country_id: "all",
      city_id: "all",
      category_id: "all",
      listing_type: "all",
      priceRange: "all",
      minBeds: "all",
      sort: "newest",
      page: 1,
      per_page: 12,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 300, behavior: "smooth" });
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
                      {isAr ? "إجمالي العقارات" : "Total Results"}
                    </p>
                    <h2 className="text-3xl font-black">
                      {meta.total || filteredProperties.length}
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
              countries={countriesOptions}
              cities={citiesOptions}
              categories={categoriesOptions}
            />

            <PropertiesList
              isAr={isAr}
              locale={locale}
              properties={filteredProperties}
              resetFilters={resetFilters}
              loading={loading}
              meta={meta}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PropertiesPage;