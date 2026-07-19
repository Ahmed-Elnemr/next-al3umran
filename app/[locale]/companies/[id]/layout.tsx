import { Metadata } from "next";
import { properties } from "../../../../src/lib/mockData";

type Props = {
  params: Promise<{ id: string; locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id, locale } = await params;
  const isAr = locale === "ar";
  
  // fetch data
  const mockProperties = properties.filter((p) => p.companyId === id);
  
  const companyAr = mockProperties[0]?.companyAr || "شركة العقارات الفاخرة";
  const companyEn = mockProperties[0]?.companyEn || "Luxury Real Estate Co.";
  
  const name = isAr ? companyAr : companyEn;
  const description = isAr 
    ? `تعرف على ${name}، إحدى الشركات الرائدة في مجال العقارات على منصة العمران.`
    : `Discover ${name}, one of the leading real estate companies on Al3umran platform.`;

  return {
    title: `${name} | العمران للعقارات`,
    description: description,
    openGraph: {
      title: `${name} | Al3umran`,
      description: description,
      images: [mockProperties[0]?.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: description,
      images: [mockProperties[0]?.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"],
    },
  };
}

export default function CompanyLayout({ children }: Props) {
  return <>{children}</>;
}
