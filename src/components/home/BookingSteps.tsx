"use client";

import { useLocale } from "next-intl";
import { ClipboardCheck, Phone, Search } from "lucide-react";

const BookingSteps = () => {
  const locale = useLocale();
  const isAr = locale === "ar";

  const steps = [
    {
      icon: Search,
      title: isAr ? "ابحث وفلتر" : "Search & Filter",
      desc: isAr
        ? "حدد المدينة، نوع العقار، السعر، المساحة وعدد الغرف."
        : "Choose city, type, price, area and bedrooms.",
    },
    {
      icon: ClipboardCheck,
      title: isAr ? "قارن التفاصيل" : "Compare Details",
      desc: isAr
        ? "راجع الصور، السعر، الموقع، المميزات وبيانات التواصل."
        : "Review photos, price, location, features and contact details.",
    },
    {
      icon: Phone,
      title: isAr ? "تواصل واحجز" : "Contact & Book",
      desc: isAr
        ? "تواصل مباشرة مع المالك أو الشركة واحجز معاينة."
        : "Contact the owner or company and book a visit.",
    },
  ];

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div>
            <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
              {isAr ? "خطوات بسيطة" : "Simple Steps"}
            </span>

            <h2 className="text-3xl lg:text-5xl font-black text-[#101820] leading-tight">
              {isAr ? "احجز عقارك في 3 خطوات" : "Book your property in 3 steps"}
            </h2>

            <p className="mt-4 text-[#63756F] leading-7 max-w-xl">
              {isAr
                ? "رحلة بسيطة من البحث إلى التواصل مع المالك أو المطور بدون تعقيد."
                : "A simple journey from search to direct communication with the owner or developer."}
            </p>

            <div className="mt-8 space-y-4">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="rounded-[28px] bg-[#F6F4EE] border border-[#E7E1D6] p-5 flex gap-4"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[#0E6B58] text-white flex items-center justify-center shrink-0">
                      <Icon size={24} />
                    </div>

                    <div>
                      <span className="text-xs font-black text-[#C89B3C]">
                        0{index + 1}
                      </span>

                      <h3 className="text-lg font-black mt-1 text-[#101820]">
                        {step.title}
                      </h3>

                      <p className="text-sm text-[#63756F] mt-2">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative rounded-[38px] overflow-hidden min-h-[520px] shadow-[0_30px_90px_rgba(16,24,32,0.18)]">
            <img
              src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1400&auto=format&fit=crop"
              alt="Booking property"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/90 via-[#101820]/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
              <h3 className="text-3xl font-black max-w-xl leading-tight">
                {isAr
                  ? "فريق العمران يساعدك في الوصول لأفضل قرار عقاري."
                  : "Al Omran team helps you reach the right property decision."}
              </h3>

              <p className="mt-3 text-white/70 leading-7 max-w-md">
                {isAr
                  ? "سواء كنت بتشتري، بتأجر أو بتعرض عقارك، التجربة كلها أبسط وأسرع."
                  : "Whether buying, renting or listing, the whole experience is faster and easier."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSteps;