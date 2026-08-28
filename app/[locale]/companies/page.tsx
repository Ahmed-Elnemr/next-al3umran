import Link from "next/link";
import { Building2, MapPin, Star, CheckCircle2 } from "lucide-react";
import { envelopeList, getCompanies } from "../../../src/lib/api/client";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompaniesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  
  const searchParamsResolved = await searchParams;
  const currentPage = Number(searchParamsResolved?.page) || 1;
  const perPage = 12;

  const response = await getCompanies(locale, `page=${currentPage}&per_page=${perPage}`).catch(() => null);
  const companies = envelopeList(response);
  const meta = response?.data?.meta || null;
  const totalPages = meta?.last_page || 1;

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#F8F9FA] py-16">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex rounded-full bg-[#0E6B58]/10 px-4 py-2 text-sm font-black text-[#0E6B58]">
            {isAr ? "شركاء النجاح" : "Our Partners"}
          </span>
          <h1 className="mb-4 text-4xl font-black text-[#101820] md:text-5xl">
            {isAr ? "الشركات العقارية المعتمدة" : "Verified Real Estate Companies"}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-[#63756F]">
            {isAr 
              ? "اكتشف أفضل الشركات العقارية وتعرف على خدماتهم المتنوعة لضمان تجربة عقارية مميزة." 
              : "Discover the best real estate companies and explore their diverse services for an exceptional real estate experience."}
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companies.map((company: any) => (
            <Link
              key={company.id}
              href={`/${locale}/companies/${company.id}`}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#E7E1D6] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#0E6B58]/10"
            >
              {/* Cover/Top Section */}
              <div className="relative h-24 bg-gradient-to-r from-[#0E6B58] to-[#148F76]">
                {company.is_verified && (
                  <div className="absolute top-3 end-3 flex h-7 items-center gap-1 rounded-full bg-white/20 px-2.5 backdrop-blur-md">
                    <CheckCircle2 size={14} className="text-white" />
                    <span className="text-xs font-bold text-white">{isAr ? "موثق" : "Verified"}</span>
                  </div>
                )}
              </div>

              {/* Logo (Overlapping) */}
              <div className="absolute start-6 top-12 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
                ) : (
                  <Building2 className="text-[#0E6B58] opacity-50" size={32} />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 pt-10">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h2 className="text-lg font-black text-[#101820] group-hover:text-[#0E6B58] transition-colors line-clamp-1">{company.name}</h2>
                  {(company.rating > 0) && (
                    <div className="flex shrink-0 items-center gap-1 rounded-md bg-[#FFF9E5] px-2 py-1">
                      <Star size={14} className="fill-[#F5C518] text-[#F5C518]" />
                      <span className="text-xs font-bold text-[#101820]">{company.rating}</span>
                    </div>
                  )}
                </div>

                <p className="mb-4 mt-2 line-clamp-2 text-sm text-[#63756F]">
                  {company.bio || (isAr ? "لا يوجد وصف متاح للشركة في الوقت الحالي." : "No description available for this company at the moment.")}
                </p>

                <div className="mt-auto space-y-2 border-t border-[#F2F0EA] pt-4">
                  {(company.city?.name || company.country?.name) && (
                    <div className="flex items-center gap-2 text-sm text-[#63756F]">
                      <MapPin size={16} className="text-[#0E6B58]" />
                      <span className="font-semibold">{[company.city?.name, company.country?.name].filter(Boolean).join(isAr ? "، " : ", ")}</span>
                    </div>
                  )}
                  {company.listings_count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-[#63756F]">
                      <Building2 size={16} className="text-[#0E6B58]" />
                      <span className="font-semibold">
                        {company.listings_count} {isAr ? "عقار متاح" : "Properties listed"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <Link
                  key={page}
                  href={`/${locale}/companies?page=${page}`}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-all ${
                    isActive 
                      ? "bg-[#0E6B58] text-white shadow-md" 
                      : "bg-white text-[#101820] hover:bg-[#F2F0EA] border border-[#E7E1D6]"
                  }`}
                >
                  {page}
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
