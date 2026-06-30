"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Castle,
  Trees,
  Building2,
  Warehouse,
  Hotel,
  Store,
  Factory,
  LandPlot,
  Search,
  Filter,
  ChevronDown,
  Grid3X3,
  LayoutList,
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Eye,
  Clock,
} from "lucide-react";

const CategoriesPage = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    {
      id: "apartments",
      icon: Home,
      title: isAr ? "شقق" : "Apartments",
      count: "4,250",
      desc: isAr
        ? "شقق متنوعة بمساحات وتشطيبات مختلفة تناسب جميع الاحتياجات"
        : "Various apartments with different sizes and finishes to suit all needs",
      color: "from-[#0E6B58] to-[#101820]",
      bg: "bg-[#EEF6F3]",
    },
    {
      id: "villas",
      icon: Castle,
      title: isAr ? "فلل" : "Villas",
      count: "1,190",
      desc: isAr
        ? "فلل فاخرة مع حدائق خاصة ومساحات واسعة للعائلات"
        : "Luxury villas with private gardens and spacious areas for families",
      color: "from-[#8A5A2B] to-[#C89B3C]",
      bg: "bg-[#F8F3EA]",
    },
    {
      id: "lands",
      icon: Trees,
      title: isAr ? "أراضي" : "Lands",
      count: "780",
      desc: isAr
        ? "أراضي سكنية وتجارية بمساحات متنوعة في مواقع استراتيجية"
        : "Residential and commercial lands of various sizes in strategic locations",
      color: "from-[#315C3F] to-[#89A86B]",
      bg: "bg-[#EEF5EC]",
    },
    {
      id: "new-projects",
      icon: Building2,
      title: isAr ? "مشاريع جديدة" : "New Projects",
      count: "320",
      desc: isAr
        ? "أحدث المشاريع العقارية بأسعار مميزة وتشطيبات فاخرة"
        : "The latest real estate projects at competitive prices with luxury finishes",
      color: "from-[#101820] to-[#0E6B58]",
      bg: "bg-[#EEF2F0]",
    },
    {
      id: "townhouses",
      icon: Warehouse,
      title: isAr ? "تاون هاوس" : "Townhouses",
      count: "450",
      desc: isAr
        ? "تاون هاوس بتصاميم حديثة في كمبوندات راقية"
        : "Modern townhouse designs in upscale compounds",
      color: "from-[#4A3728] to-[#8B7355]",
      bg: "bg-[#F5F1EC]",
    },
    {
      id: "residential-complexes",
      icon: Hotel,
      title: isAr ? "مجمعات سكنية" : "Residential Complexes",
      count: "280",
      desc: isAr
        ? "مجمعات سكنية متكاملة الخدمات بأسعار تنافسية"
        : "Integrated residential complexes with competitive prices",
      color: "from-[#1A3A4A] to-[#4A7A8A]",
      bg: "bg-[#EDF3F5]",
    },
    {
      id: "commercial",
      icon: Store,
      title: isAr ? "محلات تجارية" : "Commercial Shops",
      count: "190",
      desc: isAr
        ? "محلات ومساحات تجارية في أفضل المواقع للاستثمار"
        : "Shops and commercial spaces in prime locations for investment",
      color: "from-[#6B3A2A] to-[#B86A3A]",
      bg: "bg-[#F5F0EC]",
    },
    {
      id: "industrial",
      icon: Factory,
      title: isAr ? "أراضي صناعية" : "Industrial Lands",
      count: "95",
      desc: isAr
        ? "أراضي ومصانع في المناطق الصناعية بأسعار مناسبة"
        : "Lands and factories in industrial zones at affordable prices",
      color: "from-[#2A3A3A] to-[#5A7A7A]",
      bg: "bg-[#EDF2F2]",
    },
    {
      id: "agricultural",
      icon: LandPlot,
      title: isAr ? "أراضي زراعية" : "Agricultural Lands",
      count: "130",
      desc: isAr
        ? "أراضي زراعية خصبة في مناطق متميزة للاستثمار الزراعي"
        : "Fertile agricultural lands in distinguished areas for agricultural investment",
      color: "from-[#2A5A3A] to-[#6A9A5A]",
      bg: "bg-[#EEF5EC]",
    },
  ];

  const featuredProperties = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=90",
      titleAr: "فيلا فاخرة بحديقة خاصة",
      titleEn: "Luxury Villa With Private Garden",
      locationAr: "القاهرة الجديدة",
      locationEn: "New Cairo",
      priceAr: "12,500,000 درهم",
      priceEn: "EGP 12,500,000",
      category: "villas",
      beds: 6,
      baths: 5,
      area: 520,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=90",
      titleAr: "شقة فاخرة كاملة التشطيب",
      titleEn: "Luxury Fully Finished Apartment",
      locationAr: "العاصمة الإدارية",
      locationEn: "New Capital",
      priceAr: "4,200,000 درهم",
      priceEn: "EGP 4,200,000",
      category: "apartments",
      beds: 3,
      baths: 2,
      area: 185,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=90",
      titleAr: "تاون هاوس داخل كمبوند راقي",
      titleEn: "Townhouse In Premium Compound",
      locationAr: "الساحل الشمالي",
      locationEn: "North Coast",
      priceAr: "38,000 درهم / شهر",
      priceEn: "EGP 38,000 / Month",
      category: "townhouses",
      beds: 4,
      baths: 3,
      area: 295,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=90",
      titleAr: "أرض سكنية فرصة استثمارية",
      titleEn: "Residential Land Investment Opportunity",
      locationAr: "العين السخنة",
      locationEn: "Ain Sokhna",
      priceAr: "2,900,000 درهم",
      priceEn: "EGP 2,900,000",
      category: "lands",
      beds: 0,
      baths: 0,
      area: 750,
    },
  ];

  const filteredProperties =
    activeCategory === "all"
      ? featuredProperties
      : featuredProperties.filter((p) => p.category === activeCategory);

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
              {isAr ? "تصفح الفئات" : "Browse Categories"}
            </span>

            <h1 className="text-3xl lg:text-5xl font-black text-[#101820]">
              {isAr ? "جميع أنواع العقارات" : "All Property Types"}
            </h1>

            <p className="mt-4 text-[#63756F] leading-7 max-w-2xl">
              {isAr
                ? "تصفح جميع فئات العقارات المتاحة على منصة العمران واختر ما يناسب احتياجاتك"
                : "Browse all available property categories on Al Omran Platform and choose what suits your needs"}
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-full border border-[#E7E1D6] p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-full transition ${viewMode === "grid"
                ? "bg-[#0E6B58] text-white"
                : "text-[#63756F] hover:bg-[#EEF6F3]"
                }`}
              aria-label={isAr ? "عرض شبكي" : "Grid View"}
            >
              <Grid3X3 size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-full transition ${viewMode === "list"
                ? "bg-[#0E6B58] text-white"
                : "text-[#63756F] hover:bg-[#EEF6F3]"
                }`}
              aria-label={isAr ? "عرض قائمة" : "List View"}
            >
              <LayoutList size={18} />
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {categories.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;

            return (
              <button
                key={item.id}
                onClick={() =>
                  setActiveCategory(isActive ? "all" : item.id)
                }
                className={`group rounded-[28px] bg-white border p-6 text-left transition ${isActive
                  ? "border-[#0E6B58] shadow-[0_8px_30px_rgba(14,107,88,0.15)]"
                  : "border-[#E7E1D6] shadow-sm hover:shadow-[0_16px_50px_rgba(16,24,32,0.08)] hover:-translate-y-1"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shrink-0`}
                  >
                    <Icon size={26} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-[#101820]">
                        {item.title}
                      </h3>
                      <span className="text-xs font-bold bg-[#EEF6F3] text-[#0E6B58] px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    </div>
                    <p className="text-sm text-[#63756F] mt-1 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition shrink-0 ${isActive
                      ? "bg-[#0E6B58] text-white"
                      : "bg-[#EEF6F3] text-[#0E6B58] group-hover:bg-[#0E6B58] group-hover:text-white"
                      }`}
                  >
                    {isActive ? (
                      <CheckCircle size={16} />
                    ) : (
                      <ArrowIcon size={16} />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured Properties in Category */}
        {(activeCategory !== "all" || filteredProperties.length > 0) && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-[#101820]">
                  {isAr
                    ? `عقارات مميزة في ${categories.find(c => c.id === activeCategory)?.title || "هذه الفئة"}`
                    : `Featured Properties in ${categories.find(c => c.id === activeCategory)?.title || "This Category"}`}
                </h2>
                <p className="text-sm text-[#63756F] mt-1">
                  {filteredProperties.length}{" "}
                  {isAr ? "عقار متاح" : "properties available"}
                </p>
              </div>
              {activeCategory !== "all" && (
                <button
                  onClick={() => setActiveCategory("all")}
                  className="text-sm font-bold text-[#0E6B58] hover:underline"
                >
                  {isAr ? "عرض الكل" : "View All"}
                </button>
              )}
            </div>

            <div
              className={`grid ${viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-4 gap-5"
                : "grid-cols-1 gap-4"
                }`}
            >
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isAr={isAr}
                  locale={locale}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#0E6B58] to-[#101820] p-8 lg:p-12 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#C89B3C]/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black">
                {isAr
                  ? "هل لديك عقار وترغب في بيعه أو تأجيره؟"
                  : "Have a property to sell or rent?"}
              </h3>
              <p className="text-white/70 text-sm mt-2 max-w-2xl">
                {isAr
                  ? "انضم إلى منصة العمران واعرض عقارك أمام آلاف الباحثين عن العقارات"
                  : "Join Al Omran Platform and showcase your property to thousands of property seekers"}
              </p>
            </div>

            <Link
              href={`/${locale}/add-your-property`}
              className="h-12 rounded-full bg-[#C89B3C] text-[#101820] px-8 flex items-center gap-2 font-black hover:bg-[#d8aa49] transition shrink-0"
            >
              {isAr ? "أضف عقارك الآن" : "Add Your Property Now"}
              <ArrowIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const PropertyCard = ({
  property,
  isAr,
  locale,
  viewMode,
}: {
  property: any;
  isAr: boolean;
  locale: string;
  viewMode: "grid" | "list";
}) => {
  const title = isAr ? property.titleAr : property.titleEn;
  const location = isAr ? property.locationAr : property.locationEn;
  const price = isAr ? property.priceAr : property.priceEn;

  if (viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row gap-4 bg-white rounded-[24px] border border-[#E7E1D6] p-4 shadow-sm hover:shadow-[0_12px_40px_rgba(16,24,32,0.08)] transition">
        <div className="relative sm:w-48 h-48 sm:h-auto rounded-[16px] overflow-hidden shrink-0">
          <img
            src={property.image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <h3 className="text-lg font-black text-[#101820] line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-[#63756F] mt-1">
              <MapPin size={16} />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              {property.beds > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#63756F]">
                  <BedDouble size={16} className="text-[#0E6B58]" />
                  {property.beds}
                </span>
              )}
              {property.baths > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#63756F]">
                  <Bath size={16} className="text-[#0E6B58]" />
                  {property.baths}
                </span>
              )}
              {property.area > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#63756F]">
                  <Maximize2 size={16} className="text-[#0E6B58]" />
                  {property.area} {isAr ? "م²" : "m²"}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xl font-black text-[#0E6B58]">{price}</span>
            <Link
              href={`/${locale}/properties/${property.id}`}
              className="h-10 rounded-full bg-[#101820] text-white px-6 text-sm font-black hover:bg-[#0E6B58] transition flex items-center"
            >
              {isAr ? "عرض التفاصيل" : "View Details"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(16,24,32,0.1)]">
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={property.image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#101820] hover:bg-[#0E6B58] hover:text-white transition"
          aria-label={isAr ? "إضافة للمفضلة" : "Add to favorites"}
        >
          <Heart size={16} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <div className="flex items-center gap-1 text-white text-xs bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <MapPin size={14} />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-black text-[#101820] line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center gap-3 mt-2">
          {property.beds > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#63756F]">
              <BedDouble size={14} className="text-[#0E6B58]" />
              {property.beds}
            </span>
          )}
          {property.baths > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#63756F]">
              <Bath size={14} className="text-[#0E6B58]" />
              {property.baths}
            </span>
          )}
          {property.area > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-[#63756F]">
              <Maximize2 size={14} className="text-[#0E6B58]" />
              {property.area} {isAr ? "م²" : "m²"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0EDE8]">
          <span className="text-lg font-black text-[#0E6B58]">{price}</span>
          <Link
            href={`/${locale}/properties/${property.id}`}
            className="h-9 rounded-full bg-[#101820] text-white px-4 text-xs font-black hover:bg-[#0E6B58] transition flex items-center"
          >
            {isAr ? "تفاصيل" : "Details"}
          </Link>
        </div>
      </div>
    </article>
  );
};

// CheckCircle component for active state
const CheckCircle = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default CategoriesPage;