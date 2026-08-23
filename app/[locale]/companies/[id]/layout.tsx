import { Metadata } from "next";
import { getCompany } from "../../../../src/lib/api/client";

type Props = {
  params: Promise<{ id: string; locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const isAr = locale === "ar";

  try {
    const response = await getCompany(locale, id);
    const company = response?.data?.company || response?.data || {};
    const name = company.name || (isAr ? "شركة عقارية" : "Real Estate Company");
    const description =
      company.bio ||
      (isAr
        ? `تعرف على ${name} على منصة العمران.`
        : `Discover ${name} on the Al Omran platform.`);

    return {
      title: `${name} | ${isAr ? "العمران" : "Al Omran"}`,
      description,
    };
  } catch {
    return {
      title: isAr ? "شركة عقارية | العمران" : "Company | Al Omran",
    };
  }
}

export default function CompanyLayout({ children }: Props) {
  return <>{children}</>;
}
