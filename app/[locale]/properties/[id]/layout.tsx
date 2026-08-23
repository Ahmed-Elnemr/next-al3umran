import { Metadata } from "next";
import { getProperty } from "../../../../src/lib/api/client";

type Props = {
  params: Promise<{ id: string; locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const res = await getProperty(locale, id).catch(() => null);
  const property = res?.data;

  if (!property) {
    return {
      title: isAr ? "العقار غير موجود | العمران" : "Property Not Found | Al3umran",
    };
  }

  const title = property.title;
  const location = property.location || property.city?.name || "";
  const description = isAr
    ? `احجز عقارك الآن: ${title} في ${location}. أفضل عروض العقارات مع العمران للعقارات.`
    : `Book your property now: ${title} in ${location}. Best real estate deals with Al3umran.`;

  return {
    title: `${title} | العمران للعقارات`,
    description,
    openGraph: {
      title: `${title} | Al3umran`,
      description,
      images: property.image ? [property.image] : [],
      type: "website",
    },
  };
}

export default function PropertyLayout({ children }: Props) {
  return <>{children}</>;
}
