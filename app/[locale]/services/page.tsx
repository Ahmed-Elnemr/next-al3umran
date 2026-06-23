"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Home,
  Search,
  Handshake,
  BarChart3,
  ShieldCheck,
  Users,
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Sparkles,
  Gem,
  Layers,
  Award,
  Target,
  Eye,
  TrendingUp,
  FileText,
  Calendar,
  Briefcase,
  Compass,
  Crown,
  Heart,
  ThumbsUp,
  Zap,
} from "lucide-react";

const ServicesPage = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const services = [
    {
      id: 1,
      icon: Search,
      title: isAr ? "البحث عن عقار" : "Property Search",
      desc: isAr
        ? "نساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك من خلال قاعدة بيانات ضخمة ومتجددة."
        : "We help you find the perfect property that suits your needs and budget through a vast and updated database.",
      features: [
        isAr ? "فلترة متقدمة حسب الموقع والسعر والمساحة" : "Advanced filtering by location, price, and area",
        isAr ? "مقارنة بين العقارات المختلفة" : "Compare different properties",
        isAr ? "صور حقيقية وجولات افتراضية" : "Real images and virtual tours",
      ],
      color: "from-[#0E6B58] to-[#101820]",
    },
    {
      id: 2,
      icon: Building2,
      title: isAr ? "تسويق عقاري" : "Real Estate Marketing",
      desc: isAr
        ? "نقدم حلول تسويقية متكاملة لعرض عقارك بأفضل صورة ممكنة والوصول إلى أكبر عدد من المشترين المحتملين."
        : "We provide integrated marketing solutions to showcase your property in the best possible way and reach the largest number of potential buyers.",
      features: [
        isAr ? "تصوير احترافي وجولات 360 درجة" : "Professional photography and 360° tours",
        isAr ? "إعلانات مستهدفة على المنصات الرقمية" : "Targeted ads on digital platforms",
        isAr ? "تحليل السوق وتحديد السعر المناسب" : "Market analysis and pricing strategy",
      ],
      color: "from-[#8A5A2B] to-[#C89B3C]",
    },
    {
      id: 3,
      icon: Handshake,
      title: isAr ? "استشارات عقارية" : "Real Estate Consultancy",
      desc: isAr
        ? "فريق من الخبراء يقدم استشارات مهنية لمساعدتك في اتخاذ القرارات العقارية الصحيحة."
        : "A team of experts provides professional consultations to help you make the right real estate decisions.",
      features: [
        isAr ? "تقييم دقيق للعقارات" : "Accurate property valuation",
        isAr ? "استشارات قانونية ومالية" : "Legal and financial consultations",
        isAr ? "دراسات جدوى للمشاريع الاستثمارية" : "Feasibility studies for investment projects",
      ],
      color: "from-[#315C3F] to-[#89A86B]",
    },
    {
      id: 4,
      icon: BarChart3,
      title: isAr ? "تحليل السوق" : "Market Analysis",
      desc: isAr
        ? "نقدم تقارير دورية وتحليلات دقيقة عن حركة السوق العقاري وأحدث الاتجاهات."
        : "We provide periodic reports and accurate analysis of the real estate market and latest trends.",
      features: [
        isAr ? "تقارير فصلية عن أداء السوق" : "Quarterly market performance reports",
        isAr ? "تحليل الأسعار والطلب" : "Price and demand analysis",
        isAr ? "توقعات مستقبلية للاستثمار" : "Future investment forecasts",
      ],
      color: "from-[#1A3A4A] to-[#4A7A8A]",
    },
    {
      id: 5,
      icon: ShieldCheck,
      title: isAr ? "خدمات قانونية" : "Legal Services",
      desc: isAr
        ? "نوفر الدعم القانوني الكامل لضمان سلامة جميع المعاملات العقارية وحماية حقوقك."
        : "We provide full legal support to ensure the safety of all real estate transactions and protect your rights.",
      features: [
        isAr ? "مراجعة العقود والاتفاقيات" : "Contract and agreement review",
        isAr ? "التوثيق العقاري" : "Property documentation",
        isAr ? "حل النزاعات العقارية" : "Real estate dispute resolution",
      ],
      color: "from-[#4A3728] to-[#8B7355]",
    },
    {
      id: 6,
      icon: Users,
      title: isAr ? "إدارة الممتلكات" : "Property Management",
      desc: isAr
        ? "خدمات متكاملة لإدارة العقارات السكنية والتجارية نيابة عن الملاك."
        : "Integrated services for managing residential and commercial properties on behalf of owners.",
      features: [
        isAr ? "صيانة دورية وإدارة المرافق" : "Regular maintenance and facility management",
        isAr ? "تحصيل الإيجارات" : "Rent collection",
        isAr ? "إدارة العلاقة مع المستأجرين" : "Tenant relationship management",
      ],
      color: "from-[#2A3A3A] to-[#5A7A7A]",
    },
  ];

  const whyChoose = [
    {
      icon: Users,
      title: isAr ? "خبراء معتمدون" : "Certified Experts",
      desc: isAr
        ? "فريق من المستشارين المعتمدين بخبرة تزيد عن 12 عاماً في السوق العقاري."
        : "A team of certified consultants with over 12 years of experience in the real estate market.",
    },
    {
      icon: ShieldCheck,
      title: isAr ? "شفافية كاملة" : "Full Transparency",
      desc: isAr
        ? "نقدم جميع المعلومات بوضوح دون أي رسوم خفية أو مفاجآت غير سارة."
        : "We provide all information clearly without any hidden fees or unpleasant surprises.",
    },
    {
      icon: Clock,
      title: isAr ? "سرعة في الإنجاز" : "Fast Execution",
      desc: isAr
        ? "نحرص على إنهاء المعاملات في أسرع وقت ممكن دون التأثير على الجودة."
        : "We ensure transactions are completed as quickly as possible without compromising quality.",
    },
    {
      icon: Star,
      title: isAr ? "خدمة عملاء متميزة" : "Excellent Customer Service",
      desc: isAr
        ? "فريق دعم متاح 24/7 للإجابة على جميع استفساراتكم وحل أي مشكلة."
        : "A support team available 24/7 to answer all your inquiries and resolve any issues.",
    },
  ];

  const process = [
    {
      step: "01",
      title: isAr ? "استشارة أولية" : "Initial Consultation",
      desc: isAr
        ? "نفهم احتياجاتك ومتطلباتك بدقة لوضع خطة عمل مناسبة."
        : "We understand your needs and requirements precisely to develop a suitable action plan.",
    },
    {
      step: "02",
      title: isAr ? "بحث وتحليل" : "Search & Analysis",
      desc: isAr
        ? "نقوم بتحليل السوق والبحث عن أفضل الخيارات المتاحة."
        : "We analyze the market and search for the best available options.",
    },
    {
      step: "03",
      title: isAr ? "عرض الخيارات" : "Present Options",
      desc: isAr
        ? "نقدم لك مجموعة من الخيارات المناسبة مع تقييم شامل لكل منها."
        : "We present you with a range of suitable options with a comprehensive evaluation of each.",
    },
    {
      step: "04",
      title: isAr ? "إتمام الصفقة" : "Closing the Deal",
      desc: isAr
        ? "نساعدك في إنهاء جميع الإجراءات القانونية والمالية بكل سهولة."
        : "We help you complete all legal and financial procedures with ease.",
    },
  ];

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
            <Briefcase size={14} className={isAr ? "ml-2" : "mr-2"} />
            {isAr ? "خدماتنا" : "Our Services"}
          </span>

          <h1 className="text-3xl lg:text-5xl font-black text-[#101820] leading-[1.2]">
            {isAr
              ? "خدمات عقارية متكاملة بمعايير عالمية"
              : "Integrated Real Estate Services with Global Standards"}
          </h1>

          <p className="mt-4 text-[#63756F] leading-7 max-w-2xl mx-auto">
            {isAr
              ? "نقدم مجموعة شاملة من الخدمات العقارية المصممة لتلبية جميع احتياجاتك، من البحث عن العقار إلى إتمام الصفقة وإدارة الممتلكات."
              : "We offer a comprehensive range of real estate services designed to meet all your needs, from property search to closing the deal and property management."}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group bg-white rounded-[28px] border border-[#E7E1D6] p-6 shadow-sm hover:shadow-[0_20px_60px_rgba(16,24,32,0.10)] hover:-translate-y-1 transition"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white flex items-center justify-center mb-5`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-black text-[#101820]">
                  {service.title}
                </h3>

                <p className="text-[#63756F] leading-7 mt-2 text-sm">
                  {service.desc}
                </p>

                <ul className="mt-4 space-y-2">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className={`flex items-start gap-2 text-sm text-[#63756F] ${
                        isAr ? "flex-row" : "flex-row"
                      }`}
                    >
                      <CheckCircle
                        size={16}
                        className="text-[#0E6B58] shrink-0 mt-0.5"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/${locale}/services/${service.id}`}
                  className={`mt-5 h-11 rounded-full bg-[#F6F4EE] text-[#101820] px-5 flex items-center justify-center gap-2 font-black hover:bg-[#0E6B58] hover:text-white transition w-full ${
                    isAr ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {isAr ? "تعرف على المزيد" : "Learn More"}
                  <ArrowIcon size={16} />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8`}>
            <div className={isAr ? "text-right" : "text-left"}>
              <span className="text-sm font-black text-[#0E6B58] tracking-widest uppercase flex items-center gap-2">
                <Crown size={14} />
                {isAr ? "لماذا تختارنا" : "Why Choose Us"}
              </span>
              <h2 className="text-2xl lg:text-4xl font-black text-[#101820] mt-2">
                {isAr
                  ? "نقدم لك الأفضل في عالم العقار"
                  : "We Bring You the Best in Real Estate"}
              </h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChoose.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-[24px] border border-[#E7E1D6] p-6 text-center shadow-sm hover:shadow-[0_16px_50px_rgba(16,24,32,0.08)] transition hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center mx-auto mb-4">
                    <Icon size={26} />
                  </div>
                  <h4 className="text-lg font-black text-[#101820]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-[#63756F] leading-6 mt-2">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How We Work */}
        <div className="mb-20">
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8`}>
            <div className={isAr ? "text-right" : "text-left"}>
              <span className="text-sm font-black text-[#0E6B58] tracking-widest uppercase flex items-center gap-2">
                <Compass size={14} />
                {isAr ? "كيف نعمل" : "How We Work"}
              </span>
              <h2 className="text-2xl lg:text-4xl font-black text-[#101820] mt-2">
                {isAr
                  ? "خطوات بسيطة نحو عقار أحلامك"
                  : "Simple Steps Towards Your Dream Property"}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((item, index) => (
              <div
                key={index}
                className="relative bg-white rounded-[24px] border border-[#E7E1D6] p-6 shadow-sm hover:shadow-[0_16px_50px_rgba(16,24,32,0.08)] transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black text-[#0E6B58]/20">
                    {item.step}
                  </span>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block flex-1 h-[2px] bg-[#E7E1D6] relative">
                      <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-[#C89B3C]" />
                    </div>
                  )}
                </div>

                <h4 className="text-lg font-black text-[#101820]">
                  {item.title}
                </h4>
                <p className="text-sm text-[#63756F] leading-6 mt-2">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-[32px] bg-gradient-to-br from-[#0E6B58] to-[#101820] p-8 lg:p-12 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#C89B3C]/10 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl lg:text-3xl font-black">
                {isAr
                  ? "جاهز للبدء في رحلتك العقارية؟"
                  : "Ready to Start Your Real Estate Journey?"}
              </h3>
              <p className="text-white/70 text-sm mt-2 max-w-2xl">
                {isAr
                  ? "تواصل مع فريقنا اليوم واحصل على استشارة مجانية لمساعدتك في تحقيق أهدافك العقارية"
                  : "Contact our team today and get a free consultation to help you achieve your real estate goals"}
              </p>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="h-12 rounded-full bg-[#C89B3C] text-[#101820] px-8 flex items-center gap-2 font-black hover:bg-[#d8aa49] transition shrink-0"
            >
              {isAr ? "تواصل معنا الآن" : "Contact Us Now"}
              <ArrowIcon size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;