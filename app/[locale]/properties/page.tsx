"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Home } from "lucide-react";
import PropertyFilters from "../../../src/components/properties/PropertyFilters";
import PropertiesList from "../../../src/components/properties/PropertiesList";

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

  const properties: PropertyItem[] = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=90",
      titleAr: "فيلا فاخرة بحديقة خاصة",
      titleEn: "Luxury Villa With Private Garden",
      countryAr: "الإمارات",
      countryEn: "UAE",
      cityAr: "دبي",
      cityEn: "Dubai",
      locationAr: "دبي هيلز، دبي",
      locationEn: "Dubai Hills, Dubai",
      price: 12500000,
      currencyAr: "درهم",
      currencyEn: "AED",
      status: "sale",
      type: "villa",
      companyAr: "العمران للتسويق العقاري",
      companyEn: "Al Omran Real Estate",
      beds: 6,
      baths: 5,
      area: 520,
      createdAt: "2026-06-10",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90",
      titleAr: "منزل عائلي بتصميم حديث",
      titleEn: "Modern Family House",
      countryAr: "سوريا",
      countryEn: "Syria",
      cityAr: "دمشق",
      cityEn: "Damascus",
      locationAr: "يعفور، دمشق",
      locationEn: "Yaafour, Damascus",
      price: 890000,
      currencyAr: "دولار",
      currencyEn: "USD",
      status: "sale",
      type: "house",
      companyAr: "الصفوة العقارية",
      companyEn: "Elite Real Estate",
      beds: 5,
      baths: 4,
      area: 430,
      createdAt: "2026-06-08",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90",
      titleAr: "فيلا مستقلة بتشطيب فاخر",
      titleEn: "Standalone Villa With Luxury Finish",
      countryAr: "العراق",
      countryEn: "Iraq",
      cityAr: "بغداد",
      cityEn: "Baghdad",
      locationAr: "المنصور، بغداد",
      locationEn: "Al Mansour, Baghdad",
      price: 4200,
      currencyAr: "دولار / شهر",
      currencyEn: "USD / Month",
      status: "rent",
      type: "villa",
      companyAr: "رويال هومز",
      companyEn: "Royal Homes",
      beds: 7,
      baths: 6,
      area: 610,
      createdAt: "2026-06-06",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90",
      titleAr: "شقة فاخرة كاملة التشطيب",
      titleEn: "Fully Finished Luxury Apartment",
      countryAr: "الإمارات",
      countryEn: "UAE",
      cityAr: "أبوظبي",
      cityEn: "Abu Dhabi",
      locationAr: "جزيرة الريم، أبوظبي",
      locationEn: "Al Reem Island, Abu Dhabi",
      price: 2100000,
      currencyAr: "درهم",
      currencyEn: "AED",
      status: "sale",
      type: "apartment",
      companyAr: "نيو كابيتال بروبرتي",
      companyEn: "New Capital Property",
      beds: 3,
      baths: 2,
      area: 185,
      createdAt: "2026-06-04",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=90",
      titleAr: "تاون هاوس داخل كمبوند راقي",
      titleEn: "Townhouse In Premium Compound",
      countryAr: "سوريا",
      countryEn: "Syria",
      cityAr: "اللاذقية",
      cityEn: "Latakia",
      locationAr: "كورنيش اللاذقية",
      locationEn: "Latakia Corniche",
      price: 2500,
      currencyAr: "دولار / شهر",
      currencyEn: "USD / Month",
      status: "rent",
      type: "house",
      companyAr: "سي فيو العقارية",
      companyEn: "Sea View Realty",
      beds: 4,
      baths: 3,
      area: 295,
      createdAt: "2026-06-02",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=90",
      titleAr: "أرض سكنية فرصة استثمارية",
      titleEn: "Residential Land Investment Opportunity",
      countryAr: "العراق",
      countryEn: "Iraq",
      cityAr: "أربيل",
      cityEn: "Erbil",
      locationAr: "طريق مصيف صلاح الدين، أربيل",
      locationEn: "Salahaddin Road, Erbil",
      price: 320000,
      currencyAr: "دولار",
      currencyEn: "USD",
      status: "sale",
      type: "land",
      companyAr: "أفق للاستثمار العقاري",
      companyEn: "Ofuq Real Estate Investment",
      beds: 0,
      baths: 0,
      area: 750,
      createdAt: "2026-06-01",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=90",
      titleAr: "بيت مستقل بموقع هادئ",
      titleEn: "Standalone House In Quiet Location",
      countryAr: "سوريا",
      countryEn: "Syria",
      cityAr: "حلب",
      cityEn: "Aleppo",
      locationAr: "حلب الجديدة",
      locationEn: "New Aleppo",
      price: 450000,
      currencyAr: "دولار",
      currencyEn: "USD",
      status: "sale",
      type: "house",
      companyAr: "دارك العقارية",
      companyEn: "Darak Properties",
      beds: 5,
      baths: 4,
      area: 390,
      createdAt: "2026-05-28",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1400&q=90",
      titleAr: "دوبلكس فاخر بإطلالة مفتوحة",
      titleEn: "Luxury Duplex With Open View",
      countryAr: "العراق",
      countryEn: "Iraq",
      cityAr: "البصرة",
      cityEn: "Basra",
      locationAr: "الجزائر، البصرة",
      locationEn: "Al Jazaer, Basra",
      price: 1800,
      currencyAr: "دولار / شهر",
      currencyEn: "USD / Month",
      status: "rent",
      type: "apartment",
      companyAr: "هوم لاين العقارية",
      companyEn: "Home Line Realty",
      beds: 4,
      baths: 3,
      area: 320,
      createdAt: "2026-05-26",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=90",
      titleAr: "فيلا عصرية مع مسبح",
      titleEn: "Modern Villa With Pool",
      countryAr: "الإمارات",
      countryEn: "UAE",
      cityAr: "الشارقة",
      cityEn: "Sharjah",
      locationAr: "الجادة، الشارقة",
      locationEn: "Aljada, Sharjah",
      price: 4800000,
      currencyAr: "درهم",
      currencyEn: "AED",
      status: "sale",
      type: "villa",
      companyAr: "إعمار الخليج",
      companyEn: "Emaar Gulf",
      beds: 5,
      baths: 5,
      area: 470,
      createdAt: "2026-05-23",
    },
    {
      id: 10,
      image:
        "https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=1400&q=90",
      titleAr: "شاليه بإطلالة بحرية",
      titleEn: "Sea View Chalet",
      countryAr: "سوريا",
      countryEn: "Syria",
      cityAr: "طرطوس",
      cityEn: "Tartus",
      locationAr: "جزيرة أرواد، طرطوس",
      locationEn: "Arwad Island, Tartus",
      price: 900,
      currencyAr: "دولار / شهر",
      currencyEn: "USD / Month",
      status: "rent",
      type: "chalet",
      companyAr: "البحر المتوسط العقارية",
      companyEn: "Mediterranean Realty",
      beds: 2,
      baths: 2,
      area: 130,
      createdAt: "2026-05-20",
    },
    {
      id: 11,
      image:
        "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=90",
      titleAr: "مكتب تجاري في موقع رئيسي",
      titleEn: "Commercial Office In Prime Location",
      countryAr: "الإمارات",
      countryEn: "UAE",
      cityAr: "دبي",
      cityEn: "Dubai",
      locationAr: "الخليج التجاري، دبي",
      locationEn: "Business Bay, Dubai",
      price: 120000,
      currencyAr: "درهم / سنة",
      currencyEn: "AED / Year",
      status: "rent",
      type: "office",
      companyAr: "بزنس باي العقارية",
      companyEn: "Business Bay Realty",
      beds: 0,
      baths: 2,
      area: 210,
      createdAt: "2026-05-18",
    },
    {
      id: 12,
      image:
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=90",
      titleAr: "شقة مفروشة للإيجار",
      titleEn: "Furnished Apartment For Rent",
      countryAr: "العراق",
      countryEn: "Iraq",
      cityAr: "النجف",
      cityEn: "Najaf",
      locationAr: "حي الجامعة، النجف",
      locationEn: "University District, Najaf",
      price: 850,
      currencyAr: "دولار / شهر",
      currencyEn: "USD / Month",
      status: "rent",
      type: "apartment",
      companyAr: "رافدين العقارية",
      companyEn: "Rafidain Realty",
      beds: 3,
      baths: 2,
      area: 170,
      createdAt: "2026-05-15",
    },
  ];

  const countries = useMemo(() => {
    const map = new Map<string, string>();
    properties.forEach((item) => {
      map.set(item.countryEn, isAr ? item.countryAr : item.countryEn);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [isAr]);

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
  }, [filters.country, isAr]);

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
  }, [filters]);

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
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default PropertiesPage;