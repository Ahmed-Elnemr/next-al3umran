import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import PropertiesList from "../../../../src/components/properties/PropertiesList";
import CompanyReviews from "../../../../src/components/companies/CompanyReviews";
import { getCompany, mapApiProperty } from "../../../../src/lib/api/client";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  let payload: any = null;
  try {
    const response = await getCompany(locale, id);
    payload = response?.data || response;
  } catch {
    notFound();
  }

  const company = payload?.company || payload;
  if (!company?.id) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const properties = (Array.isArray(payload.properties) ? payload.properties : []).map(
    (item: any) => mapApiProperty(item, locale)
  );
  const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
  const companyName = company.name || "";
  const cityName = company.city?.name || "";
  const countryName = company.country?.name || "";
  const location = [cityName, countryName].filter(Boolean).join(isAr ? "، " : ", ");
  const phone = company.phone || company.whatsapp || "";
  const whatsapp = String(phone).replace(/[^\d]/g, "");

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#EEF2EC] pb-16">
      <section className="relative h-[320px] md:h-[400px]">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={company.cover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80"}
            alt={companyName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101820] via-[#101820]/60 to-transparent" />
        </div>

        <div className="absolute start-4 top-6 z-10 md:start-8 md:top-8">
          <Link
            href={`/${locale}/companies`}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white hover:text-[#101820]"
          >
            <BackIcon size={20} />
          </Link>
        </div>
      </section>

      <section className="relative mx-auto -mt-24 max-w-7xl px-4 md:-mt-32">
        <div className="rounded-[40px] border border-white/60 bg-white/80 p-6 shadow-[0_40px_100px_rgba(16,24,32,0.08)] backdrop-blur-2xl md:p-10">
          <div className={`flex flex-col items-center gap-6 text-center md:flex-row md:items-start ${isAr ? 'md:text-right' : 'md:text-left'}`}>
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[30px] border-4 border-white bg-white shadow-xl md:h-40 md:w-40">
              <div className="flex h-full w-full items-center justify-center bg-[#F6F4EE]">
                {company.logo ? (
                  <img src={company.logo} alt={companyName} className="h-full w-full object-cover" />
                ) : (
                  <Building2 size={50} className="text-[#C89B3C]" />
                )}
              </div>
            </div>

            <div className={`w-full flex-1 space-y-4 md:pt-4 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="flex flex-col items-start gap-3 md:flex-row">
                <h1 className="text-3xl font-black text-[#101820] md:text-4xl">{companyName}</h1>
                {company.is_verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0E6B58]/10 px-3 py-1.5 text-sm font-bold text-[#0E6B58]">
                    <BadgeCheck size={16} />
                    {isAr ? "موثق" : "Verified"}
                  </span>
                ) : null}
              </div>

              {company.bio ? (
                <p className={`max-w-2xl text-base leading-relaxed text-[#5E6D68] ${isAr ? 'text-right' : 'text-left'}`}>
                  {company.bio}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                {location ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-[#F8F6F1] px-4 py-2.5">
                    <MapPin size={18} className="text-[#C89B3C]" />
                    <span className="text-sm font-bold text-[#101820]">{location}</span>
                  </div>
                ) : null}
                {company.founded_year ? (
                  <div className="flex items-center gap-2 rounded-2xl bg-[#F8F6F1] px-4 py-2.5">
                    <Calendar size={18} className="text-[#C89B3C]" />
                    <span className="text-sm font-bold text-[#101820]">
                      {isAr ? `تأسست ${company.founded_year}` : `Est. ${company.founded_year}`}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 md:w-[240px] md:pt-4">
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-sm font-black text-white"
                >
                  {isAr ? "التحدث عبر الواتساب" : "Chat on WhatsApp"}
                </a>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0062FF] text-sm font-black text-white"
                >
                  <Phone size={18} />
                  {isAr ? "اتصل الآن" : "Call Now"}
                </a>
              ) : null}
              {company.email ? (
                <a
                  href={`mailto:${company.email}`}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#E8E1D5] bg-white text-sm font-black text-[#101820]"
                >
                  <Mail size={18} />
                  {isAr ? "أرسل رسالة" : "Send Email"}
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#101820] md:text-3xl">
              {isAr ? "عقارات الشركة" : "Company Properties"}
            </h2>
            <span className="inline-flex items-center justify-center rounded-xl bg-[#C89B3C] px-4 py-2 text-sm font-black text-[#101820]">
              {properties.length} {isAr ? "إعلانات" : "Listings"}
            </span>
          </div>

          <PropertiesList
            isAr={isAr}
            locale={locale}
            properties={properties}
          />

          <CompanyReviews isAr={isAr} locale={locale} companyId={company.id} reviews={reviews} token={token} />
        </div>
      </section>
    </main>
  );
}
