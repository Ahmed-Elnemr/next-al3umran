"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState, use } from "react";
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
  MessageSquare,
  ChevronDown,
  Play,
  BookOpen,
  PenTool,
  DollarSign,
  Key,
  FileCheck,
  Headphones,
  HelpCircle,
} from "lucide-react";

// This would normally come from a CMS or API based on the service ID
const getServiceData = (serviceId: string, isAr: boolean) => {
  const services: Record<string, any> = {
    "1": {
      id: "1",
      icon: Search,
      title: isAr ? "البحث عن عقار" : "Property Search",
      titleAr: "البحث عن عقار",
      titleEn: "Property Search",
      desc: isAr
        ? "نساعدك في العثور على العقار المثالي الذي يناسب احتياجاتك وميزانيتك من خلال قاعدة بيانات ضخمة ومتجددة."
        : "We help you find the perfect property that suits your needs and budget through a vast and updated database.",
      longDesc: isAr
        ? "خدمة البحث عن العقار هي بوابتك لاكتشاف أفضل الفرص العقارية المتاحة في السوق. نستخدم أحدث التقنيات وقواعد البيانات المتطورة لتوفير تجربة بحث سلسة وفعالة. سواء كنت تبحث عن منزل للعائلة، أو شقة للاستثمار، أو أرض لمشروعك القادم، فإن فريقنا المتخصص سيساعدك في العثور على الخيار المثالي. نقدم لك تصفية متقدمة حسب الموقع، السعر، المساحة، عدد الغرف، ونوع العقار، مع إمكانية مقارنة بين العقارات المختلفة لاتخاذ القرار الأمثل."
        : "The property search service is your gateway to discovering the best real estate opportunities available in the market. We use the latest technologies and advanced databases to provide a seamless and efficient search experience. Whether you're looking for a family home, an investment apartment, or land for your next project, our specialized team will help you find the perfect option. We offer advanced filtering by location, price, area, number of rooms, and property type, with the ability to compare different properties to make the optimal decision.",
      features: [
        {
          icon: Search,
          title: isAr ? "بحث متقدم" : "Advanced Search",
          desc: isAr
            ? "فلترة حسب الموقع، السعر، المساحة، عدد الغرف، وحالة العقار"
            : "Filter by location, price, area, number of rooms, and property status",
        },
        {
          icon: Eye,
          title: isAr ? "جولات افتراضية" : "Virtual Tours",
          desc: isAr
            ? "استكشف العقار من خلال جولات 360 درجة وصور عالية الجودة"
            : "Explore the property through 360° tours and high-quality images",
        },
        {
          icon: BarChart3,
          title: isAr ? "مقارنة العقارات" : "Property Comparison",
          desc: isAr
            ? "قارن بين العقارات المختلفة من حيث السعر والمساحة والموقع"
            : "Compare different properties in terms of price, area, and location",
        },
        {
          icon: Star,
          title: isAr ? "توصيات ذكية" : "Smart Recommendations",
          desc: isAr
            ? "نقترح عليك عقارات تناسب تفضيلاتك بناءً على تاريخ البحث"
            : "We suggest properties that match your preferences based on search history",
        },
      ],
      benefits: isAr
        ? [
            "توفير الوقت والجهد في البحث عن العقار المناسب",
            "الوصول إلى أكبر قاعدة بيانات عقارية محدثة باستمرار",
            "الحصول على توصيات عقارية مخصصة وفق احتياجاتك",
            "إمكانية التواصل المباشر مع المالك أو الوسيط",
          ]
        : [
            "Save time and effort in finding the right property",
            "Access to the largest constantly updated real estate database",
            "Get personalized property recommendations based on your needs",
            "Direct communication with the owner or agent",
          ],
      process: [
        {
          step: "01",
          title: isAr ? "تحديد الاحتياجات" : "Define Needs",
          desc: isAr
            ? "نفهم احتياجاتك ومتطلباتك بدقة من خلال استشارة أولية شاملة"
            : "We understand your needs and requirements precisely through a comprehensive initial consultation",
        },
        {
          step: "02",
          title: isAr ? "البحث والتصفية" : "Search & Filter",
          desc: isAr
            ? "نقوم بالبحث في قاعدة البيانات وتصفية الخيارات المناسبة"
            : "We search the database and filter suitable options",
        },
        {
          step: "03",
          title: isAr ? "عرض الخيارات" : "Present Options",
          desc: isAr
            ? "نقدم لك مجموعة من العقارات المطابقة مع تقييم شامل لكل منها"
            : "We present you with a range of matching properties with a comprehensive evaluation",
        },
        {
          step: "04",
          title: isAr ? "معاينة واتخاذ القرار" : "View & Decide",
          desc: isAr
            ? "نرتب معاينات ميدانية أو افتراضية لمساعدتك في اتخاذ القرار النهائي"
            : "We arrange on-site or virtual viewings to help you make the final decision",
        },
      ],
    },
    "2": {
      id: "2",
      icon: Building2,
      title: isAr ? "تسويق عقاري" : "Real Estate Marketing",
      titleAr: "تسويق عقاري",
      titleEn: "Real Estate Marketing",
      desc: isAr
        ? "نقدم حلول تسويقية متكاملة لعرض عقارك بأفضل صورة ممكنة والوصول إلى أكبر عدد من المشترين المحتملين."
        : "We provide integrated marketing solutions to showcase your property in the best possible way and reach the largest number of potential buyers.",
      longDesc: isAr
        ? "خدمة التسويق العقاري من العمران تهدف إلى تعزيز ظهور عقارك وجذب المشترين المهتمين. نستخدم أحدث استراتيجيات التسويق الرقمي والتقليدي لضمان وصول رسالتك إلى الجمهور المستهدف. يشمل ذلك تصويرًا احترافيًا، مقاطع فيديو ترويجية، حملات إعلانية على وسائل التواصل الاجتماعي ومحركات البحث، بالإضافة إلى نشر عقارك على جميع المنصات العقارية الرائدة. نضمن لك أقصى قدر من التعرض والوصول إلى المشترين الجادين."
        : "Al Omran's real estate marketing service aims to enhance your property's visibility and attract interested buyers. We use the latest digital and traditional marketing strategies to ensure your message reaches the target audience. This includes professional photography, promotional videos, advertising campaigns on social media and search engines, as well as listing your property on all leading real estate platforms. We guarantee maximum exposure and access to serious buyers.",
      features: [
        {
          icon: PenTool,
          title: isAr ? "تصوير احترافي" : "Professional Photography",
          desc: isAr
            ? "صور عالية الجودة تعرض تفاصيل عقارك بأفضل شكل ممكن"
            : "High-quality images showcasing your property's details in the best possible way",
        },
        {
          icon: Play,
          title: isAr ? "فيديوهات ترويجية" : "Promotional Videos",
          desc: isAr
            ? "مقاطع فيديو احترافية تعرض مميزات العقار والموقع المحيط"
            : "Professional videos showcasing the property's features and surrounding location",
        },
        {
          icon: TrendingUp,
          title: isAr ? "إعلانات مستهدفة" : "Targeted Advertising",
          desc: isAr
            ? "حملات إعلانية على منصات التواصل الاجتماعي ومحركات البحث"
            : "Advertising campaigns on social media platforms and search engines",
        },
        {
          icon: Users,
          title: isAr ? "الوصول إلى المشترين" : "Reach Buyers",
          desc: isAr
            ? "نشر عقارك على جميع المنصات العقارية للوصول لأكبر عدد من المشترين"
            : "List your property on all real estate platforms to reach the largest number of buyers",
        },
      ],
      benefits: isAr
        ? [
            "زيادة ظهور عقارك أمام المشترين المحتملين",
            "تسويق احترافي يبرز مميزات العقار بشكل جذاب",
            "الوصول إلى جمهور مستهدف من المشترين الجادين",
            "تحليل أداء الحملات وتحسينها باستمرار",
          ]
        : [
            "Increase your property's visibility to potential buyers",
            "Professional marketing that highlights the property's features attractively",
            "Reach a targeted audience of serious buyers",
            "Analyze campaign performance and continuously optimize",
          ],
      process: [
        {
          step: "01",
          title: isAr ? "تقييم العقار" : "Property Assessment",
          desc: isAr
            ? "نقوم بتقييم العقار وتحديد نقاط قوته لبناء استراتيجية تسويقية مناسبة"
            : "We assess the property and identify its strengths to build a suitable marketing strategy",
        },
        {
          step: "02",
          title: isAr ? "إعداد المحتوى" : "Content Preparation",
          desc: isAr
            ? "نقوم بتصوير العقار وإعداد المحتوى التسويقي المميز"
            : "We photograph the property and prepare outstanding marketing content",
        },
        {
          step: "03",
          title: isAr ? "الإطلاق والتوزيع" : "Launch & Distribution",
          desc: isAr
            ? "نطلق الحملة التسويقية ونوزع العقار على جميع المنصات"
            : "We launch the marketing campaign and distribute the property on all platforms",
        },
        {
          step: "04",
          title: isAr ? "المتابعة والتحليل" : "Follow-up & Analysis",
          desc: isAr
            ? "نتابع أداء الحملة ونقدم تقارير دورية مع توصيات للتحسين"
            : "We monitor campaign performance and provide periodic reports with improvement recommendations",
        },
      ],
    },
    "3": {
      id: "3",
      icon: Handshake,
      title: isAr ? "استشارات عقارية" : "Real Estate Consultancy",
      titleAr: "استشارات عقارية",
      titleEn: "Real Estate Consultancy",
      desc: isAr
        ? "فريق من الخبراء يقدم استشارات مهنية لمساعدتك في اتخاذ القرارات العقارية الصحيحة."
        : "A team of experts provides professional consultations to help you make the right real estate decisions.",
      longDesc: isAr
        ? "تقدم العمران خدمات استشارية عقارية متكاملة تساعدك على فهم السوق واتخاذ قرارات استثمارية مدروسة. فريقنا من المستشارين المعتمدين يمتلك خبرة عميقة في السوق العقاري المصري والعالمي. نقدم لك تحليلات دقيقة، تقييمات موضوعية، ورؤى استراتيجية لمساعدتك في تحقيق أهدافك العقارية. سواء كنت مستثمرًا، مطورًا، أو مشتريًا لأول مرة، فإن استشاراتنا مصممة لتلبية احتياجاتك الخاصة."
        : "Al Omran offers comprehensive real estate consultancy services that help you understand the market and make informed investment decisions. Our team of certified consultants has deep experience in the Egyptian and global real estate market. We provide you with accurate analysis, objective evaluations, and strategic insights to help you achieve your real estate goals. Whether you're an investor, developer, or first-time buyer, our consultations are designed to meet your specific needs.",
      features: [
        {
          icon: Target,
          title: isAr ? "تقييم العقارات" : "Property Valuation",
          desc: isAr
            ? "تقييم دقيق للعقارات بناءً على تحليل شامل للسوق"
            : "Accurate property valuation based on comprehensive market analysis",
        },
        {
          icon: FileCheck,
          title: isAr ? "استشارات قانونية" : "Legal Consultations",
          desc: isAr
            ? "مراجعة العقود والاتفاقيات وضمان سلامة الإجراءات القانونية"
            : "Review contracts and agreements and ensure legal procedures are sound",
        },
        {
          icon: DollarSign,
          title: isAr ? "استشارات مالية" : "Financial Consultations",
          desc: isAr
            ? "تحليل الجدوى المالية وخطط التمويل المناسبة للمشاريع العقارية"
            : "Financial feasibility analysis and appropriate financing plans for real estate projects",
        },
        {
          icon: BookOpen,
          title: isAr ? "دراسات السوق" : "Market Studies",
          desc: isAr
            ? "تقارير دورية عن تحركات السوق والاتجاهات المستقبلية"
            : "Periodic reports on market movements and future trends",
        },
      ],
      benefits: isAr
        ? [
            "اتخاذ قرارات استثمارية مدروسة ومبنية على معلومات دقيقة",
            "تجنب المخاطر القانونية والمالية في المعاملات العقارية",
            "فهم عميق لتحركات السوق والاتجاهات المستقبلية",
            "خطة استراتيجية مخصصة لتحقيق أهدافك العقارية",
          ]
        : [
            "Make informed investment decisions based on accurate information",
            "Avoid legal and financial risks in real estate transactions",
            "Deep understanding of market movements and future trends",
            "Customized strategic plan to achieve your real estate goals",
          ],
      process: [
        {
          step: "01",
          title: isAr ? "تحليل الاحتياجات" : "Needs Analysis",
          desc: isAr
            ? "نفهم أهدافك وتحدياتك من خلال جلسات استشارية متعمقة"
            : "We understand your goals and challenges through in-depth consultation sessions",
        },
        {
          step: "02",
          title: isAr ? "البحث والتحليل" : "Research & Analysis",
          desc: isAr
            ? "نجري بحثًا شاملاً وتحليلاً دقيقًا للسوق والعقارات المعنية"
            : "We conduct comprehensive research and detailed analysis of the market and relevant properties",
        },
        {
          step: "03",
          title: isAr ? "التوصيات" : "Recommendations",
          desc: isAr
            ? "نقدم لك توصيات مدروسة وخطة عمل واضحة لتحقيق أهدافك"
            : "We provide you with well-studied recommendations and a clear action plan to achieve your goals",
        },
        {
          step: "04",
          title: isAr ? "المتابعة والدعم" : "Follow-up & Support",
          desc: isAr
            ? "نقدم دعمًا مستمرًا ومراجعة دورية للتأكد من تحقيق النتائج المرجوة"
            : "We provide ongoing support and periodic reviews to ensure desired results are achieved",
        },
      ],
    },
  };

  return services[serviceId] || services["1"];
};

interface ServiceDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ServiceDetailsPage = ({ params }: ServiceDetailsPageProps) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Unwrap params using React.use()
  const { id } = use(params);
  const service = getServiceData(id, isAr);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: isAr ? "كم تستغرق عملية البحث عن عقار؟" : "How long does the property search process take?",
      answer: isAr
        ? "تختلف مدة البحث حسب متطلبات العميل ومدى توفر العقارات المناسبة. في المتوسط، تستغرق العملية بين أسبوع إلى شهر. نعمل على تسريع العملية قدر الإمكان مع الحفاظ على جودة الخيارات المقدمة."
        : "The search duration varies depending on the client's requirements and the availability of suitable properties. On average, the process takes between one week to a month. We work to expedite the process as much as possible while maintaining the quality of options presented.",
    },
    {
      id: 2,
      question: isAr ? "هل توجد رسوم إضافية لخدمات التسويق؟" : "Are there additional fees for marketing services?",
      answer: isAr
        ? "نقدم سياسة شفافة تمامًا فيما يتعلق بالرسوم. يتم الاتفاق على هيكل الرسوم مسبقًا بناءً على نوع الخدمة وحجم العمل. لا توجد أي رسوم خفية أو إضافية بدون علم العميل."
        : "We offer a completely transparent policy regarding fees. The fee structure is agreed upon in advance based on the type of service and scope of work. There are no hidden or additional fees without the client's knowledge.",
    },
    {
      id: 3,
      question: isAr ? "كيف يمكنني الاستفادة من الاستشارات العقارية؟" : "How can I benefit from real estate consultancy?",
      answer: isAr
        ? "يمكنك الاستفادة من الاستشارات العقارية من خلال تحديد احتياجاتك وأهدافك، وسيقوم فريقنا بتقديم تحليل شامل وخطط مخصصة. سواء كنت مستثمرًا جديدًا أو متمرسًا، فإن استشاراتنا تساعدك على تجنب المخاطر وتحقيق عوائد أفضل."
        : "You can benefit from real estate consultancy by identifying your needs and goals, and our team will provide comprehensive analysis and customized plans. Whether you're a new or experienced investor, our consultations help you avoid risks and achieve better returns.",
    },
  ];

  const relatedServices = [
    {
      id: "4",
      icon: BarChart3,
      title: isAr ? "تحليل السوق" : "Market Analysis",
      desc: isAr
        ? "تقارير دورية وتحليلات دقيقة عن حركة السوق العقاري"
        : "Periodic reports and accurate analysis of the real estate market",
      color: "from-[#1A3A4A] to-[#4A7A8A]",
    },
    {
      id: "5",
      icon: ShieldCheck,
      title: isAr ? "خدمات قانونية" : "Legal Services",
      desc: isAr
        ? "دعم قانوني كامل لضمان سلامة المعاملات العقارية"
        : "Full legal support to ensure the safety of real estate transactions",
      color: "from-[#4A3728] to-[#8B7355]",
    },
    {
      id: "6",
      icon: Users,
      title: isAr ? "إدارة الممتلكات" : "Property Management",
      desc: isAr
        ? "خدمات متكاملة لإدارة العقارات نيابة عن الملاك"
        : "Integrated services for managing properties on behalf of owners",
      color: "from-[#2A3A3A] to-[#5A7A7A]",
    },
  ];

  const Icon = service.icon;

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#63756F] mb-8">
          <Link href={`/${locale}`} className="hover:text-[#0E6B58] transition">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/services`} className="hover:text-[#0E6B58] transition">
            {isAr ? "الخدمات" : "Services"}
          </Link>
          <span>/</span>
          <span className="text-[#101820] font-black">{service.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-[32px] border border-[#E7E1D6] p-8 lg:p-12 shadow-sm mb-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EEF6F3] rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F8F3EA] rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start gap-8">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color || "from-[#0E6B58] to-[#101820]"} text-white flex items-center justify-center shrink-0`}
            >
              <Icon size={36} />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl lg:text-5xl font-black text-[#101820]">
                {service.title}
              </h1>
              <p className="text-lg text-[#63756F] leading-8 mt-3 max-w-3xl">
                {service.desc}
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  href={`/${locale}/contact`}
                  className="h-12 rounded-full bg-[#101820] text-white px-6 flex items-center gap-2 font-black hover:bg-[#0E6B58] transition"
                >
                  {isAr ? "طلب الخدمة" : "Request Service"}
                  <ArrowIcon size={18} />
                </Link>
                <Link
                  href="#faq"
                  className="h-12 rounded-full bg-[#F6F4EE] text-[#101820] px-6 flex items-center gap-2 font-black hover:bg-[#0E6B58] hover:text-white transition"
                >
                  <MessageSquare size={18} />
                  {isAr ? "أسئلة شائعة" : "FAQ"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white rounded-[32px] border border-[#E7E1D6] p-8 lg:p-12 shadow-sm mb-10">
          <h2 className="text-2xl lg:text-3xl font-black text-[#101820] mb-4">
            {isAr ? "نظرة عامة على الخدمة" : "Service Overview"}
          </h2>
          <p className="text-[#63756F] leading-8">{service.longDesc}</p>
        </div>

        {/* Features */}
        <div className="mb-10">
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8`}>
            <div className={isAr ? "text-right" : "text-left"}>
              <h2 className="text-2xl lg:text-3xl font-black text-[#101820]">
                {isAr ? "مميزات الخدمة" : "Service Features"}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {service.features.map((feature: any, index: number) => {
              const FeatureIcon = feature.icon;

              return (
                <div
                  key={index}
                  className="bg-white rounded-[24px] border border-[#E7E1D6] p-6 shadow-sm hover:shadow-[0_12px_40px_rgba(16,24,32,0.08)] transition hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center shrink-0">
                      <FeatureIcon size={22} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-[#101820]">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-[#63756F] leading-6 mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-[#101820] rounded-[32px] p-8 lg:p-12 text-white mb-10 overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#C89B3C]/10 blur-3xl" />

          <div className="relative z-10">
            <h3 className="text-2xl lg:text-3xl font-black mb-6">
              {isAr ? "ما الذي ستحصل عليه؟" : "What Will You Get?"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {service.benefits.map((benefit: string, index: number) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 text-white/90 ${
                    isAr ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <CheckCircle size={20} className="text-[#C89B3C] shrink-0 mt-0.5" />
                  <span className="text-sm leading-7">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process */}
        <div className="mb-10">
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8`}>
            <div className={isAr ? "text-right" : "text-left"}>
              <h2 className="text-2xl lg:text-3xl font-black text-[#101820]">
                {isAr ? "خطوات العمل" : "How It Works"}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {service.process.map((step: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-[24px] border border-[#E7E1D6] p-6 shadow-sm hover:shadow-[0_12px_40px_rgba(16,24,32,0.08)] transition hover:-translate-y-1"
              >
                <span className="text-3xl font-black text-[#0E6B58]/20">
                  {step.step}
                </span>
                <h4 className="text-lg font-black text-[#101820] mt-2">
                  {step.title}
                </h4>
                <p className="text-sm text-[#63756F] leading-6 mt-2">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mb-10">
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8`}>
            <div className={isAr ? "text-right" : "text-left"}>
              <span className="text-sm font-black text-[#0E6B58] tracking-widest uppercase flex items-center gap-2">
                <HelpCircle size={14} />
                {isAr ? "الأسئلة الشائعة" : "FAQ"}
              </span>
              <h2 className="text-2xl lg:text-3xl font-black text-[#101820] mt-2">
                {isAr
                  ? "أسئلة شائعة عن الخدمة"
                  : "Frequently Asked Questions About This Service"}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-[20px] border border-[#E7E1D6] overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(16,24,32,0.06)] transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className={`w-full flex items-start gap-4 p-5 text-left ${
                      isAr ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <span
                      className={`text-base font-black text-[#101820] flex-1 ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition ${
                        isOpen
                          ? "bg-[#0E6B58] text-white"
                          : "bg-[#EEF6F3] text-[#0E6B58]"
                      }`}
                    >
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div
                      className={`px-5 pb-5 pt-1 text-[#63756F] leading-7 text-sm border-t border-[#F0EDE8] ${
                        isAr ? "text-right" : "text-left"
                      }`}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Services */}
        <div>
          <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8`}>
            <div className={isAr ? "text-right" : "text-left"}>
              <h2 className="text-2xl lg:text-3xl font-black text-[#101820]">
                {isAr ? "خدمات ذات صلة" : "Related Services"}
              </h2>
            </div>
            <Link
              href={`/${locale}/services`}
              className="h-10 rounded-full bg-white border border-[#E7E1D6] text-[#101820] px-5 flex items-center gap-2 font-black hover:text-[#0E6B58] transition w-fit"
            >
              {isAr ? "عرض الكل" : "View All"}
              <ArrowIcon size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {relatedServices.map((related) => {
              const RelatedIcon = related.icon;

              return (
                <Link
                  key={related.id}
                  href={`/${locale}/services/${related.id}`}
                  className="bg-white rounded-[24px] border border-[#E7E1D6] p-6 shadow-sm hover:shadow-[0_12px_40px_rgba(16,24,32,0.08)] hover:-translate-y-1 transition group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${related.color} text-white flex items-center justify-center mb-4`}
                  >
                    <RelatedIcon size={24} />
                  </div>
                  <h4 className="text-lg font-black text-[#101820] group-hover:text-[#0E6B58] transition">
                    {related.title}
                  </h4>
                  <p className="text-sm text-[#63756F] leading-6 mt-1">
                    {related.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetailsPage;