import Link from "next/link";
import { notFound } from "next/navigation";
import PropertiesList from "../../../../src/components/properties/PropertiesList";
import {
  envelopeList,
  getCategory,
  getProperties,
  mapApiProperty,
} from "../../../../src/lib/api/client";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  const [categoryRes, propertiesRes] = await Promise.all([
    getCategory(locale, id).catch(() => null),
    getProperties(locale, `category_id=${id}&per_page=24`).catch(() => null),
  ]);

  const category = categoryRes?.data;
  if (!category?.id) {
    notFound();
  }

  const properties = envelopeList(propertiesRes).map((item: any) =>
    mapApiProperty(item, locale)
  );

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="bg-[#F6F4EE] py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 max-w-3xl">
          <Link href={`/${locale}/categories`} className="text-sm font-black text-[#0E6B58]">
            {isAr ? "كل الأقسام" : "All categories"}
          </Link>
          <h1 className="mt-4 text-3xl font-black text-[#101820] lg:text-5xl">{category.name}</h1>
          {category.description ? (
            <p className="mt-4 leading-7 text-[#63756F]">{category.description}</p>
          ) : null}
        </div>

        <PropertiesList isAr={isAr} locale={locale} properties={properties} />
      </div>
    </section>
  );
}
