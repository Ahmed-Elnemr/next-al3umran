import { getHomeData } from "../../../src/lib/serverActions";
import ServicesPage from "./ServicesView";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: LayoutProps) {
  const { locale } = await params;
  const homeRes = await getHomeData(locale);
  const services = homeRes?.data?.services || [];

  return <ServicesPage cmsItems={services} />;
}
