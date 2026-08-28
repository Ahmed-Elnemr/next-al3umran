"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
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
import { envelopeList, getCategories, getProperties, mapApiProperty } from "../../../src/lib/api/client";

const CategoriesPage = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [role, setRole] = useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      };
      const type = getCookie("client_type");
      if (type) {
        setRole(type);
      } else {
        const userStr = getCookie("userDataInfo");
        if (userStr) {
          try {
            const parsed = JSON.parse(decodeURIComponent(userStr));
            if (parsed?.client_type) setRole(parsed.client_type);
          } catch (e) {}
        }
      }
    }
  }, []);

  useEffect(() => {
    const icons: Record<string, any> = {
      apartments: Home,
      villas: Castle,
      lands: Trees,
      "new-projects": Building2,
      chalets: Warehouse,
      offices: Hotel,
    };
    const colors = [
      { color: "from-[#0E6B58] to-[#101820]", bg: "bg-[#EEF6F3]" },
      { color: "from-[#8A5A2B] to-[#C89B3C]", bg: "bg-[#F8F3EA]" },
      { color: "from-[#315C3F] to-[#89A86B]", bg: "bg-[#EEF5EC]" },
      { color: "from-[#101820] to-[#0E6B58]", bg: "bg-[#EEF2F0]" },
    ];
    getCategories(locale)
      .then((res) => {
        setCategories(
          envelopeList(res).map((item: any, index: number) => ({
            id: String(item.id),
            slug: item.slug,
            icon: icons[item.slug] || Building2,
            title: item.name,
            count: String(item.listings_count ?? item.listings_count ?? 0),
            desc: item.description || "",
            color: colors[index % colors.length].color,
            bg: colors[index % colors.length].bg,
          }))
        );
      })
      .catch(() => setCategories([]));
    getProperties(locale, "per_page=12")
      .then((res) => setFeaturedProperties(envelopeList(res).map((item: any) => mapApiProperty(item, locale))))
      .catch(() => setFeaturedProperties([]));
  }, [locale]);

  const filteredProperties =
    activeCategory === "all"
      ? featuredProperties
      : featuredProperties.filter(
          (p) => String(p.categoryId) === activeCategory || p.category === activeCategory
        );

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
        {activeCategory !== "all" && filteredProperties.length === 0 ? (
          <div className="mb-10 rounded-[32px] border border-[#E7E1D6] bg-white p-12 text-center shadow-[0_10px_40px_rgba(16,24,32,0.05)]">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F3EA] text-[#C89B3C]">
              <Search size={36} />
            </div>
            <h3 className="text-2xl font-black text-[#101820]">
              {isAr ? "لا توجد عقارات حالياً" : "No Properties Currently"}
            </h3>
            <p className="mt-3 text-[#63756F] max-w-md mx-auto leading-relaxed">
              {isAr
                ? "عذراً، لا توجد عقارات متاحة في هذه الفئة في الوقت الحالي. يرجى تصفح فئات أخرى أو العودة لاحقاً."
                : "Sorry, no properties are available in this category at the moment. Please browse other categories or check back later."}
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#0E6B58] px-8 font-black text-white transition hover:-translate-y-1 hover:shadow-lg"
            >
              {isAr ? "عرض كل العقارات" : "View All Properties"}
            </button>
          </div>
        ) : (activeCategory !== "all" || filteredProperties.length > 0) && (
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

            {role === "company" && (
              <Link
                href={`/${locale}/add-your-property`}
                className="h-12 rounded-full bg-[#C89B3C] text-[#101820] px-8 flex items-center gap-2 font-black hover:bg-[#d8aa49] transition shrink-0"
              >
                {isAr ? "أضف عقارك الآن" : "Add Your Property Now"}
                <ArrowIcon size={18} />
              </Link>
            )}
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