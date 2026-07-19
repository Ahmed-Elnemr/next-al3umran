"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  ChevronRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import PropertiesList from "../../../../src/components/properties/PropertiesList";
import CompanyReviews from "../../../../src/components/companies/CompanyReviews";
import { properties } from "../../../../src/lib/mockData";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

// Mock function to generate some properties for the company


export default function CompanyProfilePage({ params }: PageProps) {
  const { locale, id } = use(params);
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const mockProperties = properties.filter((p: any) => p.companyId === id);

  // Mock fetching company details based on id
  const companyAr = mockProperties[0]?.companyAr || (isAr ? "شركة العقارات الفاخرة" : "شركة العقارات الفاخرة");
  const companyEn = mockProperties[0]?.companyEn || "Luxury Real Estate Co.";

  const companyName = isAr ? companyAr : companyEn;

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#EEF2EC] pb-16">
      {/* Hero Section */}
      <section className="relative h-[320px] md:h-[400px]">
        {/* Cover Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"
            alt="Company Cover"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-[#101820]/60 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute start-4 top-6 z-10 md:start-8 md:top-8">
          <Link
            href={`/${locale}/properties`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#101820]"
          >
            <BackIcon size={20} />
          </Link>
        </div>
      </section>

      {/* Profile Details Container */}
      <section className="relative mx-auto -mt-24 max-w-7xl px-4 md:-mt-32">
        <div className="rounded-[40px] border border-white/60 bg-white/80 p-6 shadow-[0_40px_100px_rgba(16,24,32,0.08)] backdrop-blur-2xl md:p-10">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-start">
            
            {/* Logo */}
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[30px] border-4 border-white bg-white shadow-xl md:h-40 md:w-40">
              <div className="flex h-full w-full items-center justify-center bg-[#F6F4EE]">
                {mockProperties[0]?.companyLogo ? (
                  <Image 
                    src={mockProperties[0].companyLogo} 
                    alt={companyName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Building2 size={50} className="text-[#C89B3C]" />
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 md:pt-4 w-full text-start">
              <div className="flex flex-col items-start gap-3 md:flex-row">
                <h1 className="text-3xl font-black text-[#101820] md:text-4xl">
                  {companyName}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E6B58]/10 px-3 py-1.5 text-sm font-bold text-[#0E6B58]">
                  <BadgeCheck size={16} />
                  {isAr ? "موثق" : "Verified"}
                </span>
              </div>

              <p className={`max-w-2xl text-base leading-relaxed text-[#5E6D68] text-${isAr ? 'right' : 'left'}`}>
                {isAr
                  ? "نحن شركة رائدة في مجال العقارات الفاخرة، نقدم أفضل الخيارات السكنية والاستثمارية لعملائنا في جميع أنحاء العالم. نتميز بالخبرة الطويلة والخدمة الاستثنائية."
                  : "We are a leading luxury real estate company, providing the best residential and investment options for our clients worldwide. We are known for our extensive experience and exceptional service."}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                <div className="flex items-center gap-2 rounded-2xl bg-[#F8F6F1] px-4 py-2.5">
                  <MapPin size={18} className="text-[#C89B3C]" />
                  <span className="text-sm font-bold text-[#101820]">
                    {isAr ? "دبي، الإمارات" : "Dubai, UAE"}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-[#F8F6F1] px-4 py-2.5">
                  <Calendar size={18} className="text-[#C89B3C]" />
                  <span className="text-sm font-bold text-[#101820]">
                    {isAr ? "تأسست 2005" : "Est. 2005"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex w-full shrink-0 flex-col gap-3 md:w-[240px] md:pt-4">
              <a
                href="https://wa.me/971500000000"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-sm font-black text-white shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(37,211,102,0.4)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 transition-transform group-hover:scale-110"
                >
                  <path d="M11.944 0A12 12 0 000 12a12 12 0 001.914 6.542L.357 23.36l4.981-1.306A11.97 11.97 0 0011.944 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm7.142 17.135c-.294.832-1.464 1.547-2.228 1.636-.612.072-1.398.243-3.957-.818-3.074-1.272-5.06-4.423-5.215-4.63-.153-.207-1.246-1.657-1.246-3.159 0-1.503.784-2.251 1.058-2.551.273-.3.593-.375.793-.375.197 0 .393 0 .563.007.185.008.431-.072.673.513.255.614.882 2.152.96 2.308.077.155.128.337.026.541-.102.203-.153.328-.306.508-.153.18-.32.396-.46.544-.155.166-.316.347-.137.656.177.307.788 1.306 1.69 2.11 1.164 1.037 2.148 1.357 2.454 1.512.306.155.485.128.665-.078.18-.204.766-.893.97-1.199.204-.307.41-.256.69-.153.28.102 1.77.836 2.075.99.307.154.512.23.588.358.077.128.077.742-.217 1.574z" />
                </svg>
                {isAr ? "التحدث عبر الواتساب" : "Chat on WhatsApp"}
              </a>
              <a
                href="tel:+971500000000"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0062FF] text-sm font-black text-white shadow-[0_10px_30px_rgba(0,98,255,0.2)] transition-all hover:-translate-y-1 hover:bg-[#0050D1] hover:shadow-[0_20px_40px_rgba(0,98,255,0.3)]"
              >
                <Phone size={18} />
                {isAr ? "اتصل الآن" : "Call Now"}
              </a>
              <a
                href="mailto:info@company.com"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E8E1D5] bg-white text-sm font-black text-[#101820] transition hover:-translate-y-1 hover:border-[#C89B3C] hover:bg-[#F8F6F1]"
              >
                <Mail size={18} />
                {isAr ? "أرسل رسالة" : "Send Email"}
              </a>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="mt-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#101820] md:text-3xl">
              {isAr ? "عقارات الشركة" : "Company Properties"}
            </h2>
            <div className="flex items-center gap-2">
               <span className="inline-flex items-center justify-center rounded-xl bg-[#C89B3C] px-4 py-2 text-sm font-black text-[#101820]">
                 {mockProperties.length} {isAr ? "إعلانات" : "Listings"}
               </span>
            </div>
          </div>
          
          <PropertiesList
            isAr={isAr}
            locale={locale}
            properties={mockProperties}
            resetFilters={() => {}}
          />

          <CompanyReviews isAr={isAr} />
        </div>
      </section>
    </main>
  );
}
