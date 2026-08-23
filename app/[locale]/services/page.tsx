import { getSiteServices } from "../../../src/lib/serverActions";
import ServicesPage from "./ServicesView";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: LayoutProps) {
  const { locale } = await params;
  const services = await getSiteServices(locale);

  return <ServicesPage cmsItems={services?.data || []} />;
}
