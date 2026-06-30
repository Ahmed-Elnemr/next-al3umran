"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowUp,
  Building2,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const locale = useLocale();
  const isAr = locale === "ar";

  const quickLinks = [
    {
      label: isAr ? "الرئيسية" : "Home",
      href: `/${locale}`,
    },
    {
      label: isAr ? "العقارات" : "Properties",
      href: `/${locale}/categories`,
    },
    {
      label: isAr ? "أضف عقارك" : "Add Property",
      href: `/${locale}/add-your-property`,
    },
    {
      label: isAr ? "من نحن" : "About Us",
      href: `/${locale}/about`,
    },
    {
      label: isAr ? "تواصل معنا" : "Contact Us",
      href: `/${locale}/contact`,
    },
  ];

  const propertyTypes = [
    isAr ? "شقق للبيع" : "Apartments For Sale",
    isAr ? "فلل فاخرة" : "Luxury Villas",
    isAr ? "أراضي سكنية" : "Residential Lands",
    isAr ? "شاليهات" : "Chalets",
    isAr ? "عقارات للإيجار" : "Properties For Rent",
  ];

  return (
    <footer
      dir={isAr ? "rtl" : "ltr"}
      className="relative overflow-hidden bg-[#101820] text-white"
    >
      <div className="absolute -top-40 end-0 h-96 w-96 rounded-full bg-[#C89B3C]/20 blur-[110px]" />
      <div className="absolute bottom-0 start-0 h-96 w-96 rounded-full bg-[#0E6B58]/25 blur-[120px]" />

      <div className="absolute inset-0 opacity-[0.08]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-20">
        <div className="mb-16 overflow-hidden rounded-[36px] border border-white/12 bg-white/8 p-6 backdrop-blur-md md:p-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <span className="mb-4 inline-flex rounded-full bg-[#C89B3C]/15 px-4 py-2 text-sm font-black text-[#C89B3C]">
                {isAr ? "ابدأ رحلتك العقارية" : "Start Your Real Estate Journey"}
              </span>

              <h2 className="max-w-3xl text-3xl font-black leading-[1.25] md:text-5xl">
                {isAr
                  ? "هل تبحث عن عقار مناسب أو تريد عرض عقارك؟"
                  : "Looking for the right property or want to list yours?"}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-8 text-white/65">
                {isAr
                  ? "منصة العمران تجمع الباحثين عن العقارات وأصحاب الإعلانات في تجربة سهلة وواضحة."
                  : "Al Omran connects property seekers and advertisers through a simple and clear experience."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/categories`}
                className="flex h-14 items-center justify-center rounded-full bg-[#C89B3C] px-7 font-black text-[#101820] transition hover:-translate-y-1 hover:bg-[#d8aa49]"
              >
                {isAr ? "استكشف العقارات" : "Explore Properties"}
              </Link>

              <Link
                href={`/${locale}/add-your-property`}
                className="flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#101820]"
              >
                {isAr ? "أضف عقارك" : "Add Property"}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href={`/${locale}`} className="mb-5 flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C89B3C] text-[#101820]">
                <Building2 size={29} />
              </span>

              <div>
                <h3 className="text-2xl font-black">
                  {isAr ? "العمران" : "Al Omran"}
                </h3>
                <p className="text-xs font-bold text-white/55">
                  {isAr ? "للتطوير العقاري" : "Real Estate Platform"}
                </p>
              </div>
            </Link>

            <p className="max-w-md text-sm leading-8 text-white/62">
              {isAr
                ? "منصة عقارية حديثة تساعدك على البحث عن أفضل فرص البيع والإيجار والاستثمار العقاري، مع تجربة سهلة وتصميم واضح يناسب جميع المستخدمين."
                : "A modern real estate platform helping users discover sale, rent and investment opportunities through a clear and easy browsing experience."}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Send size={18} />} />
            </div>
          </div>

          <div>
            <FooterTitle title={isAr ? "روابط سريعة" : "Quick Links"} />

            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-bold text-white/62 transition hover:text-[#C89B3C]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterTitle title={isAr ? "أنواع العقارات" : "Property Types"} />

            <ul className="mt-5 space-y-3">
              {propertyTypes.map((item) => (
                <li key={item}>
                  <Link
                    href={`/${locale}/categories`}
                    className="text-sm font-bold text-white/62 transition hover:text-[#C89B3C]"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterTitle title={isAr ? "تواصل معنا" : "Contact Us"} />

            <div className="mt-5 space-y-4">
              <ContactItem
                icon={<Phone size={18} />}
                text={isAr ? "+20 100 000 0000" : "+20 100 000 0000"}
              />

              <ContactItem
                icon={<Mail size={18} />}
                text="info@alomran.com"
              />

              <ContactItem
                icon={<MapPin size={18} />}
                text={isAr ? "القاهرة، مصر" : "Cairo, Egypt"}
              />
            </div>

            <div className="mt-6 rounded-3xl border border-white/12 bg-white/8 p-4">
              <p className="mb-3 text-sm font-black text-white">
                {isAr ? "اشترك ليصلك الجديد" : "Subscribe for updates"}
              </p>

              <div className="flex overflow-hidden rounded-2xl bg-white">
                <input
                  type="email"
                  placeholder={isAr ? "بريدك الإلكتروني" : "Your email"}
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold text-[#101820] outline-none placeholder:text-[#8A9894]"
                />

                <button className="flex h-12 w-12 items-center justify-center bg-[#C89B3C] text-[#101820] transition hover:bg-[#d8aa49]">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center md:flex-row">
          <p className="text-sm font-bold text-white/50">
            {isAr
              ? "© جميع الحقوق محفوظة لمنصة العمران"
              : "© All rights reserved for Al Omran"}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 text-sm font-bold text-white/50">
            <Link href={`/${locale}/privacy`} className="transition hover:text-[#C89B3C]">
              {isAr ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>

            <Link href={`/${locale}/terms`} className="transition hover:text-[#C89B3C]">
              {isAr ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C89B3C] text-[#101820] transition hover:-translate-y-1"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterTitle = ({ title }: { title: string }) => {
  return (
    <h3 className="relative text-lg font-black text-white">
      {title}
      <span className="mt-3 block h-1 w-10 rounded-full bg-[#C89B3C]" />
    </h3>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => {
  return (
    <Link
      href="#"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:-translate-y-1 hover:border-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#101820]"
    >
      {icon}
    </Link>
  );
};

const ContactItem = ({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) => {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-white/62">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-[#C89B3C]">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
};

export default Footer;