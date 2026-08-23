import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteServices } from "../../../../src/lib/serverActions";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { locale, id } = await params;
  const isAr = locale === "ar";
  const response = await getSiteServices(locale);
  const items = Array.isArray(response?.data) ? response.data : [];
  const service = items.find((item: any) => String(item.id) === String(id));

  if (!service) {
    notFound();
  }

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="bg-[#F6F4EE] py-16">
      <div className="mx-auto max-w-4xl px-4">
        <Link href={`/${locale}/services`} className="text-sm font-black text-[#0E6B58]">
          {isAr ? "كل الخدمات" : "All services"}
        </Link>
        <h1 className="mt-4 text-3xl font-black text-[#101820] lg:text-5xl">{service.title}</h1>
        {service.description ? (
          <p className="mt-6 text-lg leading-8 text-[#63756F]">{service.description}</p>
        ) : null}
      </div>
    </section>
  );
}
