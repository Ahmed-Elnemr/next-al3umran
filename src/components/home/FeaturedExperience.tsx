"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Home,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";

const FeaturedExperience = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const cards = [
    {
      icon: <Search size={24} />,
      title: isAr ? "بحث ذكي وسريع" : "Smart Search",
      desc: isAr
        ? "اعثر على العقار المناسب حسب الموقع، النوع، السعر، والمساحة بسهولة."
        : "Find the right property by location, type, budget and space with ease.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: isAr ? "عقارات موثقة" : "Verified Listings",
      desc: isAr
        ? "نساعدك في الوصول إلى عقارات ببيانات واضحة وتجربة أكثر أمانًا."
        : "Access clear property details and a more reliable real estate experience.",
    },
    {
      icon: <MapPin size={24} />,
      title: isAr ? "مواقع مميزة" : "Prime Locations",
      desc: isAr
        ? "اختيارات عقارية في مناطق مناسبة للسكن والاستثمار والنمو."
        : "Property options in locations ideal for living, investing and growth.",
    },
  ];

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#F6F4EE] py-20 lg:py-28"
    >
      <div className="absolute -top-32 end-0 h-80 w-80 rounded-full bg-[#C89B3C]/20 blur-3xl" />
      <div className="absolute -bottom-32 start-0 h-96 w-96 rounded-full bg-[#0E6B58]/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-[38px] bg-[#101820] p-3 shadow-[0_30px_90px_rgba(16,24,32,0.18)]">
              <div className="relative h-[430px] overflow-hidden rounded-[30px]">
                <img
                  src="/images/real-estate-feature.jpg"
                  alt={isAr ? "تجربة عقارية احترافية" : "Professional real estate experience"}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/20 bg-white/15 p-5 text-white backdrop-blur-md">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C89B3C] text-[#101820]">
                    <Building2 size={24} />
                  </div>

                  <h3 className="text-2xl font-black">
                    {isAr ? "اختيار العقار أصبح أسهل" : "Choosing property is now easier"}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {isAr
                      ? "تجربة عرض حديثة تساعد المستخدم يشاهد التفاصيل ويتواصل بسرعة."
                      : "A modern browsing experience that helps users view details and connect faster."}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -end-5 -top-5 hidden rounded-3xl bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,0.12)] md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E6B58] text-white">
                  <Home size={22} />
                </div>
                <div>
                  <h4 className="font-black text-[#101820]">
                    {isAr ? "فلل وشقق وأراضي" : "Villas, Apartments & Lands"}
                  </h4>
                  <p className="text-xs font-bold text-[#60716B]">
                    {isAr ? "كل الخيارات في مكان واحد" : "All options in one place"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="mb-4 inline-flex rounded-full bg-[#0E6B58]/10 px-4 py-2 text-sm font-black text-[#0E6B58]">
              {isAr ? "تجربة عقارية متكاملة" : "Complete real estate experience"}
            </span>

            <h2 className="max-w-3xl text-3xl font-black leading-[1.25] tracking-[-0.03em] text-[#101820] md:text-5xl">
              {isAr
                ? "كل ما تحتاجه للوصول إلى العقار المناسب في تجربة واحدة"
                : "Everything you need to reach the right property in one experience"}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5A6763] md:text-lg">
              {isAr
                ? "منصة العمران مصممة لتسهيل رحلة البحث العقاري، بداية من تصفح الأقسام وحتى الوصول إلى تفاصيل العقار والتواصل مع صاحب الإعلان بشكل مباشر وواضح."
                : "Al Omran is designed to simplify the real estate journey, from browsing categories to viewing property details and contacting the advertiser directly."}
            </p>

            <div className="mt-8 grid gap-4">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="group rounded-[26px] border border-[#E4DED1] bg-white p-5 shadow-[0_16px_55px_rgba(16,24,32,0.06)] transition hover:-translate-y-1 hover:border-[#C89B3C]/60"
                >
                  <div className="flex gap-4">
                    <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#F6F4EE] text-[#0E6B58] transition group-hover:bg-[#C89B3C] group-hover:text-[#101820]">
                      {card.icon}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#101820]">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm leading-7 text-[#66736F]">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/categories`}
              className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#101820] px-7 font-black text-white transition hover:-translate-y-1 hover:bg-[#0E6B58]"
            >
              {isAr ? "ابدأ التصفح الآن" : "Start Browsing Now"}
              <ArrowIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperience;