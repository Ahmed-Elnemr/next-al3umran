import { getAboutUs } from "../../../src/lib/serverActions";
import AboutUs from "./AboutUsView";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: LayoutProps) {
  const { locale } = await params;
  const about = await getAboutUs(locale);

  return <AboutUs content={about?.data?.value} />;
}
