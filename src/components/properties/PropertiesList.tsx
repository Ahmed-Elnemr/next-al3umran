"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bath,
  BedDouble,
  Building2,
  MapPin,
  Maximize2,
  SearchX,
} from "lucide-react";
import type { PropertyItem } from "../../../app/[locale]/properties/page";

type Props = {
  isAr: boolean;
  locale: string;
  properties: PropertyItem[];
  resetFilters: () => void;
};

const PropertiesList = ({ isAr, locale, properties, resetFilters }: Props) => {
  if (properties.length === 0) {
    return (
      <div className="flex min-h-[520px] items-center justify-center rounded-[34px] border border-white/70 bg-white/80 p-8 text-center shadow-[0_25px_80px_rgba(16,24,32,0.10)] backdrop-blur-xl">
        <div>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#F6F4EE] text-[#0E6B58]">
            <SearchX size={32} />
          </div>

          <h2 className="text-2xl font-black text-[#101820]">
            {isAr ? "لا توجد عقارات مطابقة" : "No matching properties"}
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#71807B]">
            {isAr
              ? "جرّب تعديل الفلاتر أو إعادة ضبط البحث لعرض نتائج أكثر."
              : "Try changing the filters or reset the search to view more results."}
          </p>

          <button
            onClick={resetFilters}
            className="mt-6 h-12 rounded-full bg-[#101820] px-7 font-black text-white transition hover:bg-[#0E6B58]"
          >
            {isAr ? "إعادة ضبط الفلترة" : "Reset Filters"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between rounded-[26px] border border-white/70 bg-white/75 px-5 py-4 shadow-[0_18px_55px_rgba(16,24,32,0.07)] backdrop-blur-xl">
        <h2 className="text-lg font-black text-[#101820]">
          {isAr ? "العقارات المتاحة" : "Available Properties"}
        </h2>

        <p className="text-sm font-bold text-[#71807B]">
          {isAr ? `${properties.length} نتيجة` : `${properties.length} results`}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isAr={isAr}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
};

const PropertyCard = ({
  property,
  isAr,
  locale,
}: {
  property: PropertyItem;
  isAr: boolean;
  locale: string;
}) => {
  const title = isAr ? property.titleAr : property.titleEn;
  const location = isAr ? property.locationAr : property.locationEn;
  const country = isAr ? property.countryAr : property.countryEn;
  const city = isAr ? property.cityAr : property.cityEn;
  const company = isAr ? property.companyAr : property.companyEn;
  const currency = isAr ? property.currencyAr : property.currencyEn;
  const isSale = property.status === "sale";

  const typeLabel = {
    villa: isAr ? "فيلا" : "Villa",
    house: isAr ? "بيت" : "House",
    apartment: isAr ? "شقة" : "Apartment",
    land: isAr ? "أرض" : "Land",
    chalet: isAr ? "شاليه" : "Chalet",
    office: isAr ? "مكتب" : "Office",
  }[property.type];

  return (
    <article className="group flex h-full min-h-[545px] flex-col overflow-hidden rounded-[30px] border border-[#E4DED1] bg-white shadow-[0_18px_55px_rgba(16,24,32,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(16,24,32,0.16)]">
      <div className="relative h-[240px] overflow-hidden">
        <img
          src={property.image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute start-4 top-4 flex flex-wrap gap-2">
          <span
            className={`w-max rounded-full px-4 py-2 text-xs font-black shadow-lg ${
              isSale
                ? "bg-[#C89B3C] text-[#101820]"
                : "bg-[#0E6B58] text-white"
            }`}
          >
            {isSale
              ? isAr
                ? "للبيع"
                : "For Sale"
              : isAr
              ? "للإيجار"
              : "For Rent"}
          </span>

          <span className="w-max rounded-full bg-white/90 px-4 py-2 text-xs font-black text-[#101820] shadow-lg backdrop-blur">
            {typeLabel}
          </span>
        </div>

        <div className="absolute bottom-4 start-4 end-4">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm">
            <MapPin size={16} className="shrink-0 text-[#C89B3C]" />
            <span className="truncate">
              {location} - {city} - {country}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[58px] text-xl font-black leading-7 text-[#101820]">
          {title}
        </h3>

        <p className="mt-3 text-2xl font-black text-[#0E6B58]">
          {property.price !== undefined 
            ? `${property.price.toLocaleString(isAr ? "ar-EG" : "en-US")} ${currency || ''}`
            : (isAr ? property.priceAr : property.priceEn)}
        </p>

        <Link
          href={`/${locale}/companies/${property.companyId}`}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E8E1D5] bg-[#F8F6F1] px-4 py-3 transition hover:border-[#C89B3C] hover:bg-[#F0EEE6]"
        >
          <div className="relative flex h-10 w-10 shrink-0 overflow-hidden items-center justify-center rounded-xl bg-[#101820] text-white">
            {property.companyLogo ? (
              <Image src={property.companyLogo} alt={company} fill className="object-cover" />
            ) : (
              <Building2 size={18} />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#7A8782]">
              {isAr ? "الشركة المعلنة" : "Advertiser Company"}
            </p>

            <h4 className="truncate text-sm font-black text-[#101820]">
              {company}
            </h4>
          </div>
        </Link>

        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#ECE6DA] py-4">
          <PropertyInfoItem
            icon={<BedDouble size={18} />}
            value={property.beds}
            label={isAr ? "غرف" : "Beds"}
          />

          <PropertyInfoItem
            icon={<Bath size={18} />}
            value={property.baths}
            label={isAr ? "حمام" : "Baths"}
          />

          <PropertyInfoItem
            icon={<Maximize2 size={18} />}
            value={property.area}
            label={isAr ? "م²" : "m²"}
          />
        </div>

        <Link
          href={`/${locale}/properties/${property.id}`}
          className="mt-auto flex h-12 w-full items-center justify-center rounded-full bg-[#101820] text-sm font-black text-white transition hover:bg-[#0E6B58]"
        >
          {isAr ? "عرض التفاصيل" : "View Details"}
        </Link>
      </div>
    </article>
  );
};

const PropertyInfoItem = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#F6F4EE] px-2 py-3 text-center">
      <span className="text-[#0E6B58]">{icon}</span>
      <span className="text-xs font-black text-[#101820]">{value}</span>
      <span className="text-[11px] font-bold text-[#71807B]">{label}</span>
    </div>
  );
};

export default PropertiesList;