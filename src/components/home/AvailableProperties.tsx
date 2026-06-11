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
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const AvailableProperties = () => {
  const locale = useLocale();
  const isAr = locale === "ar";

  const properties = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=90",
      titleAr: "فيلا فاخرة بحديقة خاصة",
      titleEn: "Luxury Villa With Private Garden",
      locationAr: "القاهرة الجديدة",
      locationEn: "New Cairo",
      priceAr: "12,500,000 جنيه",
      priceEn: "EGP 12,500,000",
      status: "sale",
      companyAr: "العمران للتسويق العقاري",
      companyEn: "Al Omran Real Estate",
      beds: 6,
      baths: 5,
      area: 520,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90",
      titleAr: "منزل عائلي بتصميم حديث",
      titleEn: "Modern Family House",
      locationAr: "الشيخ زايد",
      locationEn: "Sheikh Zayed",
      priceAr: "8,900,000 جنيه",
      priceEn: "EGP 8,900,000",
      status: "sale",
      companyAr: "الصفوة العقارية",
      companyEn: "Elite Real Estate",
      beds: 5,
      baths: 4,
      area: 430,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=90",
      titleAr: "فيلا مستقلة بتشطيب فاخر",
      titleEn: "Standalone Villa With Luxury Finish",
      locationAr: "مدينتي",
      locationEn: "Madinaty",
      priceAr: "65,000 جنيه / شهر",
      priceEn: "EGP 65,000 / Month",
      status: "rent",
      companyAr: "رويال هومز",
      companyEn: "Royal Homes",
      beds: 7,
      baths: 6,
      area: 610,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=90",
      titleAr: "شقة فاخرة كاملة التشطيب",
      titleEn: "Fully Finished Luxury Apartment",
      locationAr: "العاصمة الإدارية",
      locationEn: "New Capital",
      priceAr: "4,200,000 جنيه",
      priceEn: "EGP 4,200,000",
      status: "sale",
      companyAr: "نيو كابيتال بروبرتي",
      companyEn: "New Capital Property",
      beds: 3,
      baths: 2,
      area: 185,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=90",
      titleAr: "تاون هاوس داخل كمبوند راقي",
      titleEn: "Townhouse In Premium Compound",
      locationAr: "الساحل الشمالي",
      locationEn: "North Coast",
      priceAr: "38,000 جنيه / شهر",
      priceEn: "EGP 38,000 / Month",
      status: "rent",
      companyAr: "سي فيو العقارية",
      companyEn: "Sea View Realty",
      beds: 4,
      baths: 3,
      area: 295,
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=90",
      titleAr: "أرض سكنية فرصة استثمارية",
      titleEn: "Residential Land Investment Opportunity",
      locationAr: "العين السخنة",
      locationEn: "Ain Sokhna",
      priceAr: "2,900,000 جنيه",
      priceEn: "EGP 2,900,000",
      status: "sale",
      companyAr: "أفق للاستثمار العقاري",
      companyEn: "Ofuq Real Estate Investment",
      beds: 0,
      baths: 0,
      area: 750,
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1400&q=90",
      titleAr: "بيت مستقل بموقع هادئ",
      titleEn: "Standalone House In Quiet Location",
      locationAr: "مدينة الشروق",
      locationEn: "El Shorouk",
      priceAr: "7,500,000 جنيه",
      priceEn: "EGP 7,500,000",
      status: "sale",
      companyAr: "دارك العقارية",
      companyEn: "Darak Properties",
      beds: 5,
      baths: 4,
      area: 390,
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1400&q=90",
      titleAr: "دوبلكس فاخر بإطلالة مفتوحة",
      titleEn: "Luxury Duplex With Open View",
      locationAr: "مدينة نصر",
      locationEn: "Nasr City",
      priceAr: "28,000 جنيه / شهر",
      priceEn: "EGP 28,000 / Month",
      status: "rent",
      companyAr: "هوم لاين العقارية",
      companyEn: "Home Line Realty",
      beds: 4,
      baths: 3,
      area: 320,
    },
  ];

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
            {properties.map((property) => (
              <SwiperSlide key={property.id} className="!h-auto">
                <PropertyCard
                  property={property}
                  isAr={isAr}
                  locale={locale}
                />
              </SwiperSlide>
            ))}
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

  return (
    <article className="group flex h-full min-h-[545px] flex-col overflow-hidden rounded-[30px] border border-[#E4DED1] bg-white shadow-[0_18px_55px_rgba(16,24,32,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(16,24,32,0.16)]">
      <div className="relative h-[250px] overflow-hidden">
        <img
          src={property.image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute start-4 top-4">
          <span
            className={`rounded-full px-4 py-2 text-xs font-black shadow-lg backdrop-blur-md ${
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

        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#E8E1D5] bg-[#F8F6F1] px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#101820] text-white">
            <Building2 size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-bold text-[#7A8782]">
              {isAr ? "الشركة المعلنة" : "Advertiser Company"}
            </p>
            <h4 className="truncate text-sm font-black text-[#101820]">
              {company}
            </h4>
          </div>
        </div>

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