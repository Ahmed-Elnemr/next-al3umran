"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building,
  CircleDollarSign,
} from "lucide-react";

const InvestmentShowcase = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const items = [
    {
      icon: <Building size={23} />,
      title: isAr ? "مشاريع جديدة" : "New Developments",
      desc: isAr
        ? "تابع أحدث المشاريع العقارية المناسبة للسكن أو الاستثمار."
        : "Explore new developments suitable for living or investment.",
    },
    {
      icon: <CircleDollarSign size={23} />,
      title: isAr ? "فرص استثمارية" : "Investment Opportunities",
      desc: isAr
        ? "اختيارات تساعدك على اتخاذ قرار أفضل حسب الموقع والسعر."
        : "Options that help you make better decisions by location and budget.",
    },
    {
      icon: <BadgeCheck size={23} />,
      title: isAr ? "اختيار بثقة" : "Choose With Confidence",
      desc: isAr
        ? "تفاصيل واضحة وصور منظمة وتجربة سهلة للباحث عن عقار."
        : "Clear details, organized visuals and an easy browsing experience.",
    },
  ];

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#101820] py-20 lg:py-28"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      <div className="absolute top-0 end-0 h-96 w-96 rounded-full bg-[#C89B3C]/20 blur-[100px]" />
      <div className="absolute bottom-0 start-0 h-96 w-96 rounded-full bg-[#0E6B58]/25 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-[#C89B3C] backdrop-blur-md">
              {isAr ? "للسكن والاستثمار" : "For Living & Investment"}
            </span>

            <h2 className="max-w-4xl text-3xl font-black leading-[1.25] tracking-[-0.03em] text-white md:text-5xl">
              {isAr
                ? "منصة تساعدك تشوف الصورة كاملة قبل اختيار عقارك"
                : "A platform that helps you see the full picture before choosing"}
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 md:text-lg">
              {isAr
                ? "العمران لا يعرض العقارات فقط، بل يقدم تجربة واضحة تساعدك على المقارنة بين الخيارات، فهم المميزات، والوصول إلى العقار الأنسب لك."
                : "Al Omran does not just display properties; it creates a clear experience to compare options, understand advantages and reach the right choice."}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[28px] border border-white/12 bg-white/8 p-5 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#C89B3C]/50 hover:bg-white/12"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C89B3C] text-[#101820]">
                    {item.icon}
                  </div>

                  <h3 className="text-lg font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-white/60">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/categories`}
              className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-7 font-black text-[#101820] shadow-[0_20px_65px_rgba(200,155,60,0.28)] transition hover:-translate-y-1 hover:bg-[#d8aa49]"
            >
              {isAr ? "شاهد الفرص المتاحة" : "View Available Opportunities"}
              <ArrowIcon size={18} />
            </Link>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[38px] border border-white/15 bg-white/10 p-4 shadow-[0_35px_100px_rgba(0,0,0,0.3)] backdrop-blur-md">
              <div className="overflow-hidden rounded-[30px]">
                <img
                  src="/images/investment-real-estate.jpg"
                  alt={isAr ? "فرص استثمارية عقارية" : "Real estate investment opportunities"}
                  className="h-[440px] w-full object-cover"
                />
              </div>

              <div className="absolute bottom-8 left-8 right-8 rounded-[28px] border border-white/20 bg-[#101820]/75 p-5 text-white backdrop-blur-md">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0E6B58] text-white">
                  <BarChart3 size={24} />
                </div>

                <h3 className="text-2xl font-black">
                  {isAr ? "قرارات أوضح وفرص أفضل" : "Clearer decisions, better opportunities"}
                </h3>

                <p className="mt-2 text-sm leading-7 text-white/65">
                  {isAr
                    ? "اعرض عقارك أو ابحث عن فرصتك التالية من خلال تجربة احترافية."
                    : "List your property or find your next opportunity through a professional experience."}
                </p>
              </div>
            </div>

            <div className="absolute -top-6 -end-5 rounded-3xl bg-white px-5 py-4 shadow-[0_22px_70px_rgba(0,0,0,0.2)]">
              <p className="text-xs font-black text-[#66736F]">
                {isAr ? "تجربة مصممة للعقار" : "Built for real estate"}
              </p>
              <h4 className="mt-1 text-xl font-black text-[#101820]">
                {isAr ? "العمران" : "Al Omran"}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentShowcase;