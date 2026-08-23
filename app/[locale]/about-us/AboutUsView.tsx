"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Crown,
  Eye,
  Users,
  Target,
  ShieldCheck,
  Sparkles,
  Gem,
  Layers,
  Award,
  CheckCircle,
} from "lucide-react";

const AboutUs = ({ content }: { content?: string }) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const values = [
    {
      icon: ShieldCheck,
      title: isAr ? "الشفافية" : "Transparency",
      desc: isAr
        ? "نلتزم بتقديم معلومات واضحة وصادقة عن كل عقار."
        : "We commit to providing clear and honest information about every property.",
    },
    {
      icon: Crown,
      title: isAr ? "الجودة" : "Quality",
      desc: isAr
        ? "نختار بعناية العقارات والشركاء لضمان أعلى مستوى."
        : "We carefully select properties and partners to ensure the highest standard.",
    },
    {
      icon: Users,
      title: isAr ? "الثقة" : "Trust",
      desc: isAr
        ? "نبني علاقات طويلة الأمد مع عملائنا وشركائنا."
        : "We build long-term relationships with our clients and partners.",
    },
    {
      icon: Target,
      title: isAr ? "الاحترافية" : "Professionalism",
      desc: isAr
        ? "فريق من الخبراء يقدم استشارات عقارية متكاملة."
        : "A team of experts providing comprehensive real estate consultations.",
    },
  ];

  const stats = [
    { value: "12+", label: isAr ? "سنوات من الخبرة" : "Years of Experience" },
    { value: "4,250+", label: isAr ? "عقار تم تسويقه" : "Properties Listed" },
    { value: "98%", label: isAr ? "رضا العملاء" : "Client Satisfaction" },
    { value: "50+", label: isAr ? "شريك معتمد" : "Certified Partners" },
  ];

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
            {isAr ? "من نحن" : "About Us"}
          </span>

          <h2 className="text-3xl lg:text-5xl font-black text-[#101820] leading-[1.2]">
            {isAr
              ? "منصة العمران .. رؤية جديدة للعقار"
              : "Al Omran Platform .. A New Vision for Real Estate"}
          </h2>

          <p className="mt-4 text-[#63756F] leading-7 max-w-2xl mx-auto">
            {isAr
              ? "نحن منصة عقارية تجمع بين التكنولوجيا والخبرة لتوفير تجربة استثنائية للباحثين عن العقارات والمستثمرين."
              : "We are a real estate platform that combines technology and expertise to provide an exceptional experience for property seekers and investors."}
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-20">
          <div className="order-2 lg:order-1">
            <span className="text-sm font-black text-[#0E6B58] tracking-widest uppercase">
              {isAr ? "قصتنا" : "Our Story"}
            </span>
            <h3 className="text-2xl lg:text-4xl font-black text-[#101820] mt-2 leading-[1.2]">
              {isAr
                ? "بدأنا لنقدم لعملائنا أفضل تجربة عقارية"
                : "We started to deliver the best real estate experience"}
            </h3>
            {content ? (
              <div
                className="text-[#63756F] leading-8 mt-4 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <>
            <p className="text-[#63756F] leading-8 mt-4">
              {isAr
                ? "انطلقت منصة العمران من رؤية واضحة وهي تسهيل عملية البحث عن العقارات وجعلها أكثر شفافية وسهولة. نؤمن بأن كل عميل يستحق تجربة عقارية فريدة تناسب احتياجاته، سواء كان يبحث عن منزل أحلامه أو فرصة استثمارية واعدة."
                : "Al Omran Platform was launched with a clear vision: to simplify the property search process and make it more transparent and accessible. We believe every client deserves a unique real estate experience that fits their needs, whether they're looking for their dream home or a promising investment opportunity."}
            </p>
            <p className="text-[#63756F] leading-8 mt-3">
              {isAr
                ? "مع فريق من الخبراء وشركاء موثوقين، نعمل على تقديم عقارات متميزة في أفضل المواقع، مع توفير كافة المعلومات اللازمة لاتخاذ قرار سليم."
                : "With a team of experts and trusted partners, we work to present distinguished properties in prime locations, providing all the necessary information for a sound decision."}
            </p>
              </>
            )}
            <Link
              href={`/${locale}/technical-support`}
              className="inline-flex items-center gap-2 h-12 rounded-full bg-[#101820] text-white px-6 font-black hover:bg-[#0E6B58] transition mt-5"
            >
              {isAr ? "تواصل معنا" : "Contact Us"}
              <ArrowIcon size={18} />
            </Link>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-[32px] overflow-hidden shadow-[0_24px_80px_rgba(16,24,32,0.15)]">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=90"
                alt={isAr ? "فريق العمران" : "Al Omran Team"}
                loading="lazy"
                className="w-full h-[320px] lg:h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101820]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 text-white">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                  <Building2 size={22} className="text-[#C89B3C]" />
                  <div>
                    <p className="text-xs font-bold text-white/70">
                      {isAr ? "عقارات موثقة" : "Verified Properties"}
                    </p>
                    <p className="text-sm font-black">4,250+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                  <Users size={22} className="text-[#C89B3C]" />
                  <div>
                    <p className="text-xs font-bold text-white/70">
                      {isAr ? "عميل سعيد" : "Happy Clients"}
                    </p>
                    <p className="text-sm font-black">2,800+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-[24px] bg-white border border-[#E7E1D6] p-6 text-center shadow-sm hover:shadow-[0_16px_50px_rgba(16,24,32,0.08)] transition"
            >
              <span className="text-3xl lg:text-4xl font-black text-[#0E6B58]">
                {stat.value}
              </span>
              <p className="text-sm font-bold text-[#63756F] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-sm font-black text-[#0E6B58] tracking-widest uppercase">
              {isAr ? "قيمنا" : "Our Values"}
            </span>
            <h3 className="text-2xl lg:text-4xl font-black text-[#101820] mt-2">
              {isAr ? "ما الذي نمثله" : "What We Stand For"}
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-[24px] bg-white border border-[#E7E1D6] p-6 text-center shadow-sm hover:shadow-[0_16px_50px_rgba(16,24,32,0.08)] transition"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center mx-auto mb-4">
                    <Icon size={26} />
                  </div>
                  <h4 className="text-lg font-black text-[#101820]">
                    {value.title}
                  </h4>
                  <p className="text-sm text-[#63756F] leading-6 mt-2">
                    {value.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="rounded-[32px] bg-[#101820] p-8 lg:p-12 text-white overflow-hidden relative">
          {/* subtle pattern background */}
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#C89B3C]/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#0E6B58]/10 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
              <div>
                <span className="inline-flex rounded-full bg-white/10 text-[#C89B3C] border border-white/10 px-4 py-2 text-xs font-black mb-3">
                  {isAr ? "لماذا تختار العمران؟" : "Why Choose Al Omran?"}
                </span>
                <h3 className="text-2xl lg:text-4xl font-black">
                  {isAr
                    ? "نساعدك على اتخاذ القرار العقاري الصحيح"
                    : "We help you make the right real estate decision"}
                </h3>
              </div>
              <Link
                href={`/${locale}/properties`}
                className="h-12 rounded-full bg-[#C89B3C] text-[#101820] px-6 flex items-center gap-2 font-black hover:bg-[#d8aa49] transition w-fit shrink-0"
              >
                {isAr ? "استكشف العقارات" : "Explore Properties"}
                <ArrowIcon size={18} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: <Gem size={22} />,
                  title: isAr ? "عقارات مميزة" : "Premium Properties",
                  desc: isAr
                    ? "تشكيلة واسعة من العقارات الفاخرة في أفضل المواقع."
                    : "A wide selection of luxury properties in prime locations.",
                },
                {
                  icon: <Sparkles size={22} />,
                  title: isAr ? "تجربة سهلة" : "Seamless Experience",
                  desc: isAr
                    ? "واجهة بسيطة وبحث ذكي يوفر وقتك وجهدك."
                    : "A simple interface and smart search that saves time and effort.",
                },
                {
                  icon: <Layers size={22} />,
                  title: isAr ? "خبرة واسعة" : "Extensive Expertise",
                  desc: isAr
                    ? "فريق متمرس في السوق العقارية مع معرفة دقيقة بالمجال."
                    : "An experienced team with deep knowledge of the real estate market.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="rounded-[20px] bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#C89B3C]/20 text-[#C89B3C] flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-black">{item.title}</h4>
                  <p className="text-white/70 text-sm leading-6 mt-1">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;