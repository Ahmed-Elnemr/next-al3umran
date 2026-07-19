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
  const property = properties.find((item) => item.id === Number(id));
  
  if (!property) {
    return {
      title: isAr ? "العقار غير موجود | العمران" : "Property Not Found | Al3umran",
    };
  }

  const title = isAr ? property.titleAr : property.titleEn;
  const location = isAr ? property.locationAr : property.locationEn;
  const description = isAr 
    ? `احجز عقارك الآن: ${title} في ${location}. أفضل عروض العقارات مع العمران للعقارات.`
    : `Book your property now: ${title} in ${location}. Best real estate deals with Al3umran.`;

  return {
    title: `${title} | العمران للعقارات`,
    description: description,
    openGraph: {
      title: `${title} | Al3umran`,
      description: description,
      images: [property.image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [property.image],
    },
  };
}

export default function PropertyLayout({ children }: Props) {
  return <>{children}</>;
}
