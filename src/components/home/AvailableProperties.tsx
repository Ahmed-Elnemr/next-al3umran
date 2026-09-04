"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  MapPin,
  Maximize2,
  Heart
} from "lucide-react";
import Image from "next/image";
import { mapApiProperty } from "../../lib/api/client";
import { useFavorites } from "../../hooks/useFavorites";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const AvailableProperties = ({ items = [] }: { items?: any[] }) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const properties = items.map((item) => mapApiProperty(item, locale));

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#EEF2EC] py-16 md:py-20 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,60,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,107,88,0.22),transparent_35%)]" />
      <div className="absolute inset-0 opacity-[0.35] bg-[linear-gradient(rgba(16,24,32,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(16,24,32,0.055)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute left-1/2 top-10 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-white/45 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="overflow-hidden rounded-[38px] border border-white/70 bg-white/60 p-4 shadow-[0_30px_100px_rgba(16,24,32,0.10)] backdrop-blur-xl md:p-7 lg:p-9">
          <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex rounded-full bg-[#0E6B58]/10 px-4 py-2 text-sm font-black text-[#0E6B58]">
                {isAr ? "العقارات المتاحة" : "Available Properties"}
              </span>

              <h2 className="text-3xl font-black leading-[1.25] tracking-[-0.03em] text-[#101820] md:text-5xl">
                {isAr
                  ? "عقارات مميزة تناسب السكن والاستثمار"
                  : "Featured properties for living and investment"}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-[#5E6D68]">
                {isAr
                  ? "استعرض مجموعة مختارة من الفلل، البيوت، الشقق والأراضي مع معرفة نوع الإعلان والشركة المعلنة لكل عقار."
                  : "Explore selected villas, homes, apartments and lands with listing type and advertiser company shown clearly."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href={`/${locale}/properties`}
                className="inline-flex items-center justify-center rounded-full bg-[#0E6B58] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#101820]"
              >
                {isAr ? "عرض الكل" : "View All"}
              </Link>
              <div className="flex items-center gap-2">
              <button
                type="button"
                className="property-prev flex h-12 w-12 items-center justify-center rounded-full border border-[#D9D1C3] bg-white text-[#101820] shadow-sm transition hover:bg-[#101820] hover:text-white"
              >
                {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
              </button>

              <button
                type="button"
                className="property-next flex h-12 w-12 items-center justify-center rounded-full bg-[#101820] text-white shadow-sm transition hover:bg-[#0E6B58]"
              >
                {isAr ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
              </button>
              </div>
            </div>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            dir={isAr ? "rtl" : "ltr"}
            key={isAr ? "properties-slider-rtl" : "properties-slider-ltr"}
            spaceBetween={22}
            slidesPerView={1}
            loop={properties.length > 4}
            speed={900}
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              prevEl: ".property-prev",
              nextEl: ".property-next",
            }}
            breakpoints={{
              640: { slidesPerView: 1.25, spaceBetween: 18 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 22 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="!overflow-hidden !pb-2"
          >
            {properties.map((property, index) => {
              if (!property) return null;
              return (
                <SwiperSlide key={String(property.id) || index} className="!h-auto">
                  <PropertyCard
                    property={property}
                    isAr={isAr}
                    locale={locale}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

const PropertyCard = ({
  property,
  isAr,
  locale,
}: {
  property: any;
  isAr: boolean;
  locale: string;
}) => {
  const title = isAr ? property.titleAr : property.titleEn;
  const location = isAr ? property.locationAr : property.locationEn;
  const price = isAr ? property.priceAr : property.priceEn;
  const company = isAr ? property.companyAr : property.companyEn;
  const isSale = property.status === "sale";
  
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  return (
    <article className="group flex h-full min-h-[545px] flex-col overflow-hidden rounded-[30px] border border-[#E4DED1] bg-white shadow-[0_18px_55px_rgba(16,24,32,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(16,24,32,0.16)]">
      <div className="relative h-[250px] overflow-hidden bg-gray-100 flex items-center justify-center">
        {property.image ? (
          <img
            src={property.image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(property.id, isAr);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur transition-all hover:scale-110"
          >
            <Heart 
              size={18} 
              className={favorited ? "fill-red-500 text-red-500" : "text-gray-600"} 
            />
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute start-4 top-4">
          <span
            className={`rounded-full px-4 py-2 text-xs font-black shadow-lg backdrop-blur-md ${isSale
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
        </div>

        <div className="absolute bottom-4 start-4 end-4">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-black/45 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm">
            <MapPin size={16} className="shrink-0 text-[#C89B3C]" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[58px] text-xl font-black leading-7 text-[#101820]">
          {title}
        </h3>

        <p className="mt-3 text-2xl font-black text-[#0E6B58]">{price}</p>

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

export default AvailableProperties;