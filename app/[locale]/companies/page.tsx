import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { envelopeList, getCompanies } from "../../../src/lib/api/client";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function CompaniesPage({ params }: PageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const response = await getCompanies(locale, "per_page=24").catch(() => null);
  const companies = envelopeList(response);

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#F6F4EE] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="mb-8 text-3xl font-black text-[#101820] md:text-5xl">
          {isAr ? "الشركات العقارية" : "Real Estate Companies"}
        </h1>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company: any) => (
            <Link
              key={company.id}
              href={`/${locale}/companies/${company.id}`}
              className="rounded-[28px] border border-[#E7E1D6] bg-white p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-[#F6F4EE]">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="text-[#C89B3C]" />
                )}
              </div>
              <h2 className="text-xl font-black text-[#101820]">{company.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-[#63756F]">{company.bio}</p>
              {(company.city?.name || company.country?.name) && (
                <p className="mt-4 flex items-center gap-2 text-sm font-bold text-[#0E6B58]">
                  <MapPin size={16} />
                  {[company.city?.name, company.country?.name].filter(Boolean).join(isAr ? "، " : ", ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
