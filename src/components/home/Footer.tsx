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
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";

const Footer = ({
  contact,
  general,
  categories = [],
}: {
  contact?: any;
  general?: any;
  categories?: any[];
}) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const siteName = general?.site_name || (isAr ? "العمران" : "Al Omran");
  const tagline = general?.site_tagline || (isAr ? "للتطوير العقاري" : "Real Estate Platform");
  const logo = general?.footer_logo || general?.header_logo || general?.logo;

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
        return null;
      };
      const type = getCookie("client_type");
      if (type) {
        setRole(type);
      } else {
        const userStr = getCookie("userDataInfo");
        if (userStr) {
          try {
            const parsed = JSON.parse(decodeURIComponent(userStr));
            if (parsed?.client_type) setRole(parsed.client_type);
          } catch (e) {}
        }
      }
    }
  }, []);

  const socials = [
    { href: contact?.facebook_link, icon: <Facebook size={18} /> },
    { href: contact?.instagram_link, icon: <Instagram size={18} /> },
    { href: contact?.x_link, icon: <Twitter size={18} /> },
    { href: contact?.telegram_link, icon: <Send size={18} /> },
    { href: contact?.youtube_link, icon: <Youtube size={18} /> },
  ].filter((item) => Boolean(item.href));

  const importantLinks = [
    {
      id: "services",
      label: isAr ? "الخدمات" : "Services",
      href: `/${locale}/services`,
    },
    {
      id: "companies",
      label: isAr ? "الشركات" : "Companies",
      href: `/${locale}/companies`,
    },
    ...(role === "company"
      ? [
          {
            id: "packages",
            label: isAr ? "الباقات" : "Packages",
            href: `/${locale}/packages`,
          },
        ]
      : []),
    {
      id: "faq",
      label: isAr ? "الأسئلة الشائعة" : "FAQ",
      href: `/${locale}/faq`,
    },
    {
      id: "privacy",
      label: isAr ? "سياسة الخصوصية" : "Privacy Policy",
      href: `/${locale}/privacy`,
    },
    {
      id: "terms",
      label: isAr ? "الشروط والأحكام" : "Terms & Conditions",
      href: `/${locale}/terms`,
    },
  ];
  const quickLinks = [
    {
      label: isAr ? "الرئيسية" : "Home",
      href: `/${locale}`,
    },
    {
      label: isAr ? "العقارات" : "Properties",
      href: `/${locale}/categories`,
    },
    ...(role === "company"
      ? [
          {
            label: isAr ? "أضف عقارك" : "Add Property",
            href: `/${locale}/add-your-property`,
          },
        ]
      : []),
    {
      label: isAr ? "من نحن" : "About Us",
      href: `/${locale}/about-us`,
    },
    {
      label: isAr ? "تواصل معنا" : "Contact Us",
      href: `/${locale}/technical-support`,
    },
    {
      label: isAr ? "المدونة" : "Blogs",
      href: `/${locale}/blogs`,
    },
    ...(!role
      ? [
          {
            label: isAr ? "تسجيل الدخول" : "Login",
            href: `/${locale}/login`,
          },
          {
            label: isAr ? "إنشاء حساب" : "Sign Up",
            href: `/${locale}/register`,
          },
        ]
      : []),
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

              {role === "company" && (
                <Link
                  href={`/${locale}/add-your-property`}
                  className="flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 font-black text-white transition hover:-translate-y-1 hover:bg-white hover:text-[#101820]"
                >
                  {isAr ? "أضف عقارك" : "Add Property"}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link href={`/${locale}`} className="mb-5 flex items-center gap-3">
              <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-[#C89B3C] text-[#101820]">
                {logo ? (
                  <img src={logo} alt={siteName} className="h-full w-full object-contain" />
                ) : (
                  <Building2 size={29} />
                )}
              </span>

              <div>
                <h3 className="text-2xl font-black">{siteName}</h3>
                {tagline ? (
                  <p className="text-xs font-bold text-white/55">{tagline}</p>
                ) : null}
              </div>
            </Link>

            <p className="max-w-md text-sm leading-8 text-white/62">
              {contact?.footer_text ||
                (isAr
                  ? "منصة عقارية حديثة تساعدك على البحث عن أفضل فرص البيع والإيجار والاستثمار العقاري، مع تجربة سهلة وتصميم واضح يناسب جميع المستخدمين."
                  : "A modern real estate platform helping users discover sale, rent and investment opportunities through a clear and easy browsing experience.")}
            </p>

            {socials.length > 0 ? (
              <div className="mt-6 flex items-center gap-3">
                {socials.map((social) => (
                  <SocialIcon key={social.href} icon={social.icon} href={social.href} />
                ))}
              </div>
            ) : null}
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
            <FooterTitle title={isAr ? "روابط هامة" : "Important Links"} />

            <ul className="mt-5 space-y-3">
              {importantLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-sm font-bold text-white/62 transition hover:text-[#C89B3C]"
                  >
                    {item.label}
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
                text={contact?.contact_numbers?.[0] || contact?.whatsapp_number || "+20 100 000 0000"}
                href={`tel:${contact?.contact_numbers?.[0] || contact?.whatsapp_number || "+20 100 000 0000"}`}
              />

              <ContactItem
                icon={<Mail size={18} />}
                text={contact?.email || "info@al3umran.com"}
                href={`mailto:${contact?.email || "info@al3umran.com"}`}
              />

              <ContactItem
                icon={<MapPin size={18} />}
                text={contact?.address || (isAr ? "القاهرة، مصر" : "Cairo, Egypt")}
              />
            </div>


          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 py-6 text-center lg:flex-row">
          <p className="text-sm font-bold text-white/50">
            {contact?.copyright ||
              (isAr
                ? "© جميع الحقوق محفوظة لمنصة العمران"
                : "© All rights reserved for Al Omran")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <img
                key={num}
                src={`/images/pay-${num}.png`}
                alt={`pay-${num}`}
                className="h-5 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>

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

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href: string }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white transition hover:-translate-y-1 hover:border-[#C89B3C] hover:bg-[#C89B3C] hover:text-[#101820]"
    >
      {icon}
    </Link>
  );
};

const ContactItem = ({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href?: string;
}) => {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-white/62">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 text-[#C89B3C]">
        {icon}
      </span>
      {href ? (
        <a href={href} className="transition hover:text-[#C89B3C]" dir="ltr">
          {text}
        </a>
      ) : (
        <span>{text}</span>
      )}
    </div>
  );
};

export default Footer;