import TechnicalSupport from "../../../src/components/technical-support";
import { getContactData } from "../../../src/lib/serverActions";
import { envelopeList, getFaqs } from "../../../src/lib/api/client";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

export default async function page({ params }: LayoutProps) {
  const { locale } = await params;
  const [faqsRes, contactRes] = await Promise.all([
    getFaqs(locale).catch(() => null),
    getContactData(locale),
  ]);

  return (
    <TechnicalSupport
      faqs={envelopeList(faqsRes)}
      contact={contactRes?.data || {}}
    />
  );
}
