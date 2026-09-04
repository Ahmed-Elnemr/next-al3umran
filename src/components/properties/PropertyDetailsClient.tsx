"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { ensureHttps } from "../../lib/helper";
import { useFavorites } from "../../hooks/useFavorites";

export default function PropertyDetailsClient({
  property,
  locale,
  isAr,
}: {
  property: any;
  locale: string;
  isAr: boolean;
}) {
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const [mainImage, setMainImage] = useState<string | null>(null);

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  const currentMainImage = ensureHttps(mainImage || property.image);

  const title = isAr ? property.titleAr : property.titleEn;
  const location = isAr ? property.locationAr : property.locationEn;
  const price = isAr ? property.priceAr : property.priceEn;
  const company = isAr ? property.companyAr : property.companyEn;
  const description = isAr ? property.descriptionAr : property.descriptionEn;
  const isSale = property.status === "sale";
  const visibleGallery = (property.gallery || [property.image])
    .filter((img: any) => typeof img === 'string' && img.trim() !== "")
    .map((img: string) => ensureHttps(img))
    .slice(0, 5);

  const whatsappText = encodeURIComponent(
    isAr
      ? `مرحبًا، أريد الاستفسار عن العقار: ${property.titleAr}`
      : `Hello, I want to inquire about this property: ${property.titleEn}`
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    isDragging.current = true;
    sliderRef.current.classList.add("cursor-grabbing");

    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    sliderRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    sliderRef.current?.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !sliderRef.current) return;

    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;

    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <main
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen bg-[#EEF2EC] pt-5 pb-32"
    >
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center mb-6">
            <Link
              href={`/${locale}/properties`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#101820] shadow-sm transition hover:bg-[#101820] hover:text-white"
            >
              <BackIcon size={18} />
              {isAr ? "العودة للعقارات" : "Back to Properties"}
            </Link>

            <button
              onClick={() => toggleFavorite(property.id, isAr)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_rgba(16,24,32,0.05)] transition hover:scale-110"
            >
              <Heart 
                size={22} 
                className={favorited ? "fill-red-500 text-red-500" : "text-gray-600"} 
              />
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[36px] border border-white/70 bg-white/65 p-4 shadow-[0_30px_100px_rgba(16,24,32,0.10)] backdrop-blur-xl">
              <div className="relative h-[460px] overflow-hidden rounded-[28px] bg-gray-100 flex items-center justify-center">
                {currentMainImage ? (
                  <Image
                    src={currentMainImage}
                    alt={title}
                    fill
                    priority
                    className="object-cover transition-opacity duration-300"
                  />
                ) : (
                  <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <span
                  className={`absolute start-5 top-5 w-max rounded-full px-5 py-2 text-sm font-black shadow-lg ${isSale
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

                <div className="absolute bottom-5 start-5 end-5">
                  <h1 className="max-w-3xl text-3xl font-black leading-tight text-white md:text-5xl">
                    {title}
                  </h1>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                    <MapPin size={17} className="text-[#C89B3C]" />
                    {location}
                  </div>
                </div>
              </div>

              {visibleGallery.length > 0 && (
                <div className="mt-4 overflow-hidden rounded-[28px] bg-white p-3">
                  <div
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex cursor-grab select-none gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {visibleGallery.map((img: string, index: number) => (
                      <div
                        key={`${img}-${index}`}
                        className={`relative h-32 shrink-0 overflow-hidden rounded-2xl ${
                          visibleGallery.length <= 3
                            ? "w-[calc(33.333%-8px)]"
                            : visibleGallery.length === 4
                              ? "w-[calc(25%-9px)]"
                              : "w-[calc(20%-10px)]"
                        } min-w-[170px]`}
                      >
                        {img && img.trim() !== "" ? (
                          <div
                            onClick={() => setMainImage(img)}
                            className="relative w-full h-full cursor-pointer"
                          >
                            <Image
                              src={img}
                              alt={`${title} ${index + 1}`}
                              fill
                              className={`object-cover transition duration-500 hover:scale-105 ${
                                currentMainImage === img ? "opacity-100" : "opacity-70 hover:opacity-100"
                              }`}
                            />
                          </div>
                        ) : (
                          <div 
                            onClick={() => setMainImage(img)}
                            className={`w-full h-full bg-gray-100 flex items-center justify-center cursor-pointer transition duration-500 hover:scale-105 ${
                              currentMainImage === img ? "opacity-100" : "opacity-70 hover:opacity-100"
                            }`}
                          >
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="rounded-[36px] border border-white/70 bg-white p-6 shadow-[0_30px_100px_rgba(16,24,32,0.10)]">
              <p className="text-sm font-black text-[#7A8782]">
                {isAr ? "السعر" : "Price"}
              </p>

              <h2 className="mt-2 text-4xl font-black text-[#0E6B58]">
                {price}
              </h2>

              <Link
                href={`/${locale}/companies/${property.companyId}`}
                className="mt-6 block rounded-3xl border border-[#E8E1D5] bg-[#F8F6F1] p-5 transition hover:border-[#C89B3C] hover:bg-[#F0EEE6]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 overflow-hidden items-center justify-center rounded-2xl bg-[#101820] text-white">
                    {property.companyLogo ? (
                      <Image src={property.companyLogo} alt={company} fill className="object-cover" />
                    ) : (
                      <Building2 size={22} />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#7A8782]">
                      {isAr ? "الشركة المعلنة" : "Advertiser Company"}
                    </p>
                    <h3 className="text-lg font-black text-[#101820]">
                      {company}
                    </h3>
                  </div>
                </div>
              </Link>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <DetailBox
                  icon={<BedDouble size={22} />}
                  value={property.beds}
                  label={isAr ? "غرف" : "Beds"}
                />

                <DetailBox
                  icon={<Bath size={22} />}
                  value={property.baths}
                  label={isAr ? "حمام" : "Baths"}
                />

                <DetailBox
                  icon={<Maximize2 size={22} />}
                  value={property.area}
                  label={isAr ? "م²" : "m²"}
                />
              </div>

              <div className="mt-6 space-y-3">
                <a
                  href={`https://wa.me/${property.whatsapp}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] font-black text-white transition hover:-translate-y-1 hover:bg-[#1fb85a]"
                >
                  <MessageCircle size={20} />
                  {isAr
                    ? "تواصل مع الشركة عبر واتساب"
                    : "Contact Company on WhatsApp"}
                </a>

                <a
                  href={`tel:${property.phone}`}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#101820] font-black text-white transition hover:bg-[#0E6B58]"
                >
                  <Phone size={19} />
                  {isAr ? "تواصل هاتفيًا" : "Call Now"}
                </a>

                <a
                  href={`mailto:${property.email}`}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-full border border-[#D9D1C3] bg-white font-black text-[#101820] transition hover:bg-[#C89B3C]"
                >
                  <Mail size={19} />
                  {isAr ? "إرسال رسالة" : "Send Message"}
                </a>
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.4fr]">
            <section className="rounded-[36px] border border-white/70 bg-white p-8 shadow-[0_20px_70px_rgba(16,24,32,0.08)] md:p-12">
              <h2 className="text-2xl font-black text-[#101820]">
                {isAr ? "وصف العقار" : "Property Description"}
              </h2>

              <p className="mt-4 text-base leading-9 text-[#5E6D68]">
                {description}
              </p>
            </section>

            {property.features && property.features.length > 0 && (
              <section className="rounded-[36px] border border-white/70 bg-white p-8 shadow-[0_20px_70px_rgba(16,24,32,0.08)] md:p-12">
                <h2 className="text-2xl font-black text-[#101820]">
                  {isAr ? "مميزات العقار" : "Property Features"}
                </h2>

                <div className="mt-5 space-y-3">
                  {property.features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm font-bold text-[#5E6D68]"
                    >
                      <CheckCircle2 size={18} className="text-[#0E6B58]" />
                      {feature}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

const DetailBox = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => {
  return (
    <div className="rounded-2xl bg-[#F6F4EE] p-4 text-center">
      <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#0E6B58]">
        {icon}
      </div>

      <p className="text-lg font-black text-[#101820]">{value}</p>

      <p className="text-xs font-bold text-[#71807B]">{label}</p>
    </div>
  );
};
