"use client";

import { useLocale } from "next-intl";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

const WhyAlOmran = ({ items = [] }: { items?: any[] }) => {
  const locale = useLocale();
  const isAr = locale === "ar";

  const features = (items.length ? items : [
    {
      icon: "shield",
      title: isAr ? "عقارات موثقة" : "Verified Listings",
      description: isAr
        ? "عرض بيانات واضحة وصور حقيقية وتواصل مباشر مع المالك أو الوسيط."
        : "Clear data, real visuals and direct communication with owners or agents.",
    },
    {
      icon: "sparkles",
      title: isAr ? "بحث ذكي وسريع" : "Smart Search",
      description: isAr
        ? "فلترة حسب الموقع، السعر، النوع، عدد الغرف، المساحة وحالة العقار."
        : "Filter by location, price, type, bedrooms, area and property status.",
    },
    {
      icon: "badge",
      title: isAr ? "واجهة احترافية" : "Premium Interface",
      description: isAr
        ? "تصميم حديث يمنح العميل ثقة وراحة أثناء تصفح العقارات."
        : "A modern interface that builds trust while browsing properties.",
    },
  ]).map((feature) => ({
    ...feature,
    Icon:
      feature.icon === "sparkles"
        ? Sparkles
        : feature.icon === "badge"
          ? BadgeCheck
          : ShieldCheck,
  }));

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
            {isAr ? "لماذا العمران؟" : "Why Al Omran?"}
          </span>

          <h2 className="text-3xl lg:text-5xl font-black text-[#101820]">
            {isAr ? "تجربة عقارية أوضح وأسرع" : "A clearer and faster real estate experience"}
          </h2>

          <p className="mt-4 text-[#63756F] leading-7">
            {isAr
              ? "صممنا المنصة لتكون مناسبة للباحث عن عقار وللمطور والوسيط العقاري في نفس الوقت."
              : "Built for property seekers, developers and real estate agents in one seamless platform."}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.Icon;

            return (
              <div
                key={feature.title}
                className="rounded-[34px] bg-white border border-[#E7E1D6] p-7 shadow-sm hover:shadow-[0_24px_70px_rgba(16,24,32,0.1)] transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center mb-6">
                  <Icon size={27} />
                </div>

                <h3 className="text-xl font-black text-[#101820]">
                  {feature.title}
                </h3>

                <p className="text-[#63756F] leading-7 mt-3">
                  {feature.description || feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyAlOmran;