"use client";

import Link from "next/link";
import { use, useRef } from "react";
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

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const { locale, id } = use(params);
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const properties = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "فيلا فاخرة بحديقة خاصة",
      titleEn: "Luxury Villa With Private Garden",
      locationAr: "القاهرة الجديدة",
      locationEn: "New Cairo",
      priceAr: "12,500,000 جنيه",
      priceEn: "EGP 12,500,000",
      status: "sale",
      companyAr: "العمران للتسويق العقاري",
      companyEn: "Al Omran Real Estate",
      whatsapp: "201000000000",
      phone: "+20 100 000 0000",
      email: "info@alomran.com",
      beds: 6,
      baths: 5,
      area: 520,
      descriptionAr:
        "فيلا فاخرة بتصميم عصري وحديقة خاصة، مناسبة للسكن العائلي والاستثمار في موقع مميز قريب من الخدمات الرئيسية.",
      descriptionEn:
        "A luxury villa with a modern design and private garden, suitable for family living and investment in a prime location close to key services.",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "منزل عائلي بتصميم حديث",
      titleEn: "Modern Family House",
      locationAr: "الشيخ زايد",
      locationEn: "Sheikh Zayed",
      priceAr: "8,900,000 جنيه",
      priceEn: "EGP 8,900,000",
      status: "sale",
      companyAr: "الصفوة العقارية",
      companyEn: "Elite Real Estate",
      whatsapp: "201011111111",
      phone: "+20 101 111 1111",
      email: "sales@elite-realestate.com",
      beds: 5,
      baths: 4,
      area: 430,
      descriptionAr:
        "منزل عائلي حديث بتشطيبات راقية ومساحات عملية، مناسب للعائلات الباحثة عن الراحة والخصوصية.",
      descriptionEn:
        "A modern family house with premium finishing and practical spaces, ideal for families seeking comfort and privacy.",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "فيلا مستقلة بتشطيب فاخر",
      titleEn: "Standalone Villa With Luxury Finish",
      locationAr: "مدينتي",
      locationEn: "Madinaty",
      priceAr: "65,000 جنيه / شهر",
      priceEn: "EGP 65,000 / Month",
      status: "rent",
      companyAr: "رويال هومز",
      companyEn: "Royal Homes",
      whatsapp: "201022222222",
      phone: "+20 102 222 2222",
      email: "contact@royalhomes.com",
      beds: 7,
      baths: 6,
      area: 610,
      descriptionAr:
        "فيلا مستقلة للإيجار بتشطيب فاخر ومساحة كبيرة، مناسبة للسكن الراقي طويل المدى.",
      descriptionEn:
        "A standalone villa for rent with luxury finishing and spacious areas, suitable for premium long-term living.",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600607688960-e095ff83135c?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "شقة فاخرة كاملة التشطيب",
      titleEn: "Fully Finished Luxury Apartment",
      locationAr: "العاصمة الإدارية",
      locationEn: "New Capital",
      priceAr: "4,200,000 جنيه",
      priceEn: "EGP 4,200,000",
      status: "sale",
      companyAr: "نيو كابيتال بروبرتي",
      companyEn: "New Capital Property",
      whatsapp: "201033333333",
      phone: "+20 103 333 3333",
      email: "info@newcapitalproperty.com",
      beds: 3,
      baths: 2,
      area: 185,
      descriptionAr:
        "شقة فاخرة كاملة التشطيب في موقع مميز داخل العاصمة الإدارية، مناسبة للسكن أو الاستثمار.",
      descriptionEn:
        "A fully finished luxury apartment in a prime location inside the New Capital, suitable for living or investment.",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=90",
      gallery: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=90",
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=90",
      ],
      titleAr: "تاون هاوس داخل كمبوند راقي",
      titleEn: "Townhouse In Premium Compound",
      locationAr: "الساحل الشمالي",
      locationEn: "North Coast",
      priceAr: "38,000 جنيه / شهر",
      priceEn: "EGP 38,000 / Month",
      status: "rent",
      companyAr: "سي فيو العقارية",
      companyEn: "Sea View Realty",
      whatsapp: "201044444444",
      phone: "+20 104 444 4444",
      email: "sales@seaviewrealty.com",
      beds: 4,
      baths: 3,
      area: 295,
      descriptionAr:
        "تاون هاوس للإيجار داخل كمبوند راقٍ، مناسب لقضاء فترات طويلة في موقع هادئ ومميز.",
      descriptionEn:
        "A townhouse for rent inside a premium compound, ideal for long stays in a calm and distinguished location.",
    },
  ];

  const property = properties.find((item) => item.id === Number(id));

  if (!property) {
    return (
      <main
        dir={isAr ? "rtl" : "ltr"}
        className="flex min-h-screen items-center justify-center bg-[#EEF2EC] px-4"
      >
        <div className="rounded-[32px] bg-white p-8 text-center shadow-[0_20px_70px_rgba(16,24,32,0.10)]">
          <h1 className="text-2xl font-black text-[#101820]">
            {isAr ? "العقار غير موجود" : "Property Not Found"}
          </h1>

          <Link
            href={`/${locale}`}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#101820] px-6 font-black text-white"
          >
            {isAr ? "العودة للرئيسية" : "Back Home"}
          </Link>
        </div>
      </main>
    );
  }

  const title = isAr ? property.titleAr : property.titleEn;
  const location = isAr ? property.locationAr : property.locationEn;
  const price = isAr ? property.priceAr : property.priceEn;
  const company = isAr ? property.companyAr : property.companyEn;
  const description = isAr ? property.descriptionAr : property.descriptionEn;
  const isSale = property.status === "sale";
  const visibleGallery = property.gallery.slice(0, 5);

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
      className="min-h-screen bg-[#EEF2EC] pt-5 pb-16"
    >
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,155,60,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,107,88,0.18),transparent_35%)]" />
        <div className="absolute inset-0 opacity-[0.22] bg-[linear-gradient(rgba(16,24,32,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,24,32,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative mx-auto max-w-7xl px-4">
          <Link
            href={`/${locale}`}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#101820] shadow-sm transition hover:bg-[#101820] hover:text-white"
          >
            <BackIcon size={18} />
            {isAr ? "العودة للرئيسية" : "Back Home"}
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-[36px] border border-white/70 bg-white/65 p-4 shadow-[0_30px_100px_rgba(16,24,32,0.10)] backdrop-blur-xl">
              <div className="relative h-[460px] overflow-hidden rounded-[28px]">
                <img
                  src={property.image}
                  alt={title}
                  draggable={false}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <span
                  className={`absolute start-5 top-5 w-max rounded-full px-5 py-2 text-sm font-black shadow-lg ${
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

              <div className="mt-4 overflow-hidden rounded-[28px] bg-white p-3">
                <div
                  ref={sliderRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  className="flex cursor-grab select-none gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {visibleGallery.map((img, index) => (
                    <div
                      key={`${img}-${index}`}
                      className={`h-32 shrink-0 overflow-hidden rounded-2xl ${
                        visibleGallery.length === 1
                          ? "w-full"
                          : visibleGallery.length === 2
                          ? "w-[calc(50%-6px)]"
                          : visibleGallery.length === 3
                          ? "w-[calc(33.333%-8px)]"
                          : visibleGallery.length === 4
                          ? "w-[calc(25%-9px)]"
                          : "w-[calc(20%-10px)]"
                      } min-w-[170px]`}
                    >
                      <img
                        src={img}
                        alt={`${title} ${index + 1}`}
                        draggable={false}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="rounded-[36px] border border-white/70 bg-white p-6 shadow-[0_30px_100px_rgba(16,24,32,0.10)]">
              <p className="text-sm font-black text-[#7A8782]">
                {isAr ? "السعر" : "Price"}
              </p>

              <h2 className="mt-2 text-4xl font-black text-[#0E6B58]">
                {price}
              </h2>

              <div className="mt-6 rounded-3xl border border-[#E8E1D5] bg-[#F8F6F1] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#101820] text-white">
                    <Building2 size={22} />
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
              </div>

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
            <section className="rounded-[36px] border border-white/70 bg-white p-6 shadow-[0_20px_70px_rgba(16,24,32,0.08)] md:p-8">
              <h2 className="text-2xl font-black text-[#101820]">
                {isAr ? "وصف العقار" : "Property Description"}
              </h2>

              <p className="mt-4 text-base leading-9 text-[#5E6D68]">
                {description}
              </p>
            </section>

            <section className="rounded-[36px] border border-white/70 bg-white p-6 shadow-[0_20px_70px_rgba(16,24,32,0.08)]">
              <h2 className="text-2xl font-black text-[#101820]">
                {isAr ? "مميزات العقار" : "Property Features"}
              </h2>

              <div className="mt-5 space-y-3">
                {(isAr
                  ? [
                      "موقع مميز",
                      "قريب من الخدمات",
                      "تشطيب فاخر",
                      "مساحات عملية",
                    ]
                  : [
                      "Prime location",
                      "Close to services",
                      "Luxury finishing",
                      "Practical spaces",
                    ]
                ).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm font-bold text-[#5E6D68]"
                  >
                    <CheckCircle2 size={18} className="text-[#0E6B58]" />
                    {item}
                  </div>
                ))}
              </div>
            </section>
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