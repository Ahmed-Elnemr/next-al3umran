import { Metadata } from "next";
import { getProperty, mapApiProperty } from "../../../../src/lib/api/client";
import { ensureHttps } from "../../../../src/lib/helper";

type Props = {
  params: Promise<{ id: string; locale: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  const res = await getProperty(locale, id).catch(() => null);
  
  if (!res?.data) {
    return {
      title: isAr ? "العقار غير موجود | العمران" : "Property Not Found | Al3umran",
    };
  }

  const property = mapApiProperty(res.data, locale);
  
  // Custom SEO Title: [Type] [For Sale/Rent] in [Location] - [Area] m² | Al3umran
  // e.g. فيلا للبيع في دبي هيلز بمساحة 520 م² | العمران
  const typeStr = isAr ? (property.type === 'villa' ? 'فيلا' : property.type === 'apartment' ? 'شقة' : property.type === 'land' ? 'أرض' : 'عقار') 
                     : property.type;
  const statusStr = isAr ? (property.status === 'sale' ? 'للبيع' : 'للإيجار') : (property.status === 'sale' ? 'For Sale' : 'For Rent');
  const locationStr = isAr ? property.locationAr : property.locationEn;
  const areaStr = property.area ? (isAr ? `بمساحة ${property.area} م²` : `Area ${property.area} m²`) : '';
  
  const generatedTitle = isAr 
    ? `${typeStr} ${statusStr} في ${locationStr} ${areaStr} | العمران`
    : `${typeStr} ${statusStr} in ${locationStr} ${areaStr} | Al3umran`;

  const description = isAr
    ? `احجز عقارك الآن: ${property.titleAr} في ${locationStr}. أفضل عروض العقارات مع العمران للعقارات.`
    : `Book your property now: ${property.titleEn} in ${locationStr}. Best real estate deals with Al3umran.`;

  const mainImg = property.image ? ensureHttps(property.image) : "";

  return {
    title: generatedTitle,
    description,
    openGraph: {
      title: generatedTitle,
      description,
      images: mainImg ? [{ url: mainImg }] : [],
      type: "website",
      url: `https://al3umran.com/${locale}/properties/${id}`,
    },
    alternates: {
      canonical: `https://al3umran.com/${locale}/properties/${id}`,
    },
  };
}

export default async function PropertyLayout({ children, params }: Props) {
  const { id, locale } = await params;
  const isAr = locale === "ar";
  
  let schemaData = null;
  let breadcrumbData = null;
  
  try {
    const res = await getProperty(locale, id);
    if (res?.data) {
      const property = mapApiProperty(res.data, locale);
      const title = isAr ? property.titleAr : property.titleEn;
      const description = isAr ? property.descriptionAr : property.descriptionEn;
      
      schemaData = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": title,
        "description": description,
        "image": ensureHttps(property.image),
        "url": `https://al3umran.com/${locale}/properties/${id}`,
        "offers": {
          "@type": "Offer",
          "price": property.price,
          "priceCurrency": property.currencyEn || "AED",
        }
      };

      breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": isAr ? "الرئيسية" : "Home",
            "item": `https://al3umran.com/${locale}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": isAr ? "العقارات" : "Properties",
            "item": `https://al3umran.com/${locale}/properties`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": `https://al3umran.com/${locale}/properties/${id}`
          }
        ]
      };
    }
  } catch (e) {}

  return (
    <>
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
      {breadcrumbData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
        />
      )}
      {children}
    </>
  );
}
