import { envelopeList, getFaqs } from "@/lib/api/client";
import Faq from "../../../src/components/faq";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export const dynamic = "force-dynamic";

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  const res = await getFaqs(locale).catch(() => null);
  const faq_items = envelopeList(res);

  return (
    <div className="">
      <Faq faq_items={faq_items} />
    </div>
  );
}
