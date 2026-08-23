import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function LegacyServicePage({ params }: Props) {
  const { locale, id } = await params;
  redirect(`/${locale}/services/${id}`);
}
