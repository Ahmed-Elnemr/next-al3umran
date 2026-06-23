"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Menu,
  X,
  UserRound,
  ChevronDown,
  PlusCircle,
  Building2,
  Home,
  Info,
  Grid3X3,
  Headphones,
  Newspaper,
} from "lucide-react";

import LanguageSelector from "./LanguageSwitcher";
import UserDropdown from "./UserDropdown";
import ConfirmWalletModal from "./ConfirmWalletModal";
import apiServiceCall from "../../lib/apiServiceCall";

interface NavbarProps {
  token?: string;
  bank_account: boolean;
  logo: string;
  role: string;
  notificationsUnReadCount: string;
}

const Navbar = ({
  token,
  logo,
  role,
  notificationsUnReadCount,
}: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [name, setName] = useState<string | undefined>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const locale = useLocale();
  const t = useTranslations("navbar");
  const isAuthenticated = !!token;
  const isAr = locale === "ar";

  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    {
      href: `/${locale}`,
      label: t("home"),
      icon: Home,
    },
    {
      href: `/${locale}/about-us`,
      label: t("aboutUs"),
      icon: Info,
    },
    {
      href: `/${locale}/categories`,
      label: t("categories"),
      icon: Grid3X3,
    },
    {
      href: `/${locale}/services`,
      label: t("latestEvents"),
      icon: Newspaper,
    },
    {
      href: `/${locale}/technical-support`,
      label: t("support"),
      icon: Headphones,
    },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const response = await apiServiceCall({
          method: "GET",
          url: "auth/me",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setName(response?.data?.user?.name || "");
        setProfileImage(response?.data?.user?.profile_image_url || "");
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    if (!logo) return;

    let link: HTMLLinkElement | null =
      document.querySelector("link[rel~='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = logo;
  }, [logo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && mobileDropdownOpen) setMobileDropdownOpen(false);
  }, [menuOpen, mobileDropdownOpen]);

  useEffect(() => {
    if (mobileDropdownOpen && menuOpen) setMenuOpen(false);
  }, [mobileDropdownOpen, menuOpen]);

  const handleMenuToggle = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <div className="relative hidden items-center gap-3 lg:flex">
          {role === "company" && (
            <Link
              href={`/${locale}/sell-your-service`}
              className="flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-5 text-sm font-bold text-[#101820] shadow-[0_14px_35px_rgba(200,155,60,0.28)] transition hover:-translate-y-0.5"
            >
              <PlusCircle size={18} />
              <span>{t("sellTicket")}</span>
            </Link>
          )}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex h-[50px] min-w-[190px] items-center justify-between gap-3 rounded-full border border-[#DCE6E2] bg-white/90 px-3 text-[#101820] shadow-sm transition hover:border-[#0E6B58]/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#DCE6E2] bg-[#EEF6F3]">
                  <Image
                    src={profileImage}
                    width={36}
                    height={36}
                    alt="user"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className={isAr ? "text-right" : "text-left"}>
                  <p className="text-[11px] text-[#7B8B86]">{t("welcome")}</p>
                  <p className="max-w-[92px] truncate text-xs font-bold text-[#101820]">
                    {name}
                  </p>
                </div>
              </div>

              <ChevronDown size={16} className="text-[#0E6B58]" />
            </button>

            <UserDropdown
              notificationsUnReadCount={notificationsUnReadCount}
              onWalletClick={() => setWalletModalOpen(true)}
              isOpen={dropdownOpen}
              locale={locale}
              token={token}
              onClose={() => setDropdownOpen(false)}
              name={name}
              role={role}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="hidden items-center gap-3 lg:flex">
        <Link
          href={`/${locale}/register`}
          className="flex h-[48px] items-center justify-center rounded-full border border-[#0E6B58]/25 px-5 text-sm font-bold text-[#0E6B58] transition hover:bg-[#EEF6F3]"
        >
          {t("newAccount")}
        </Link>

        <Link
          href={`/${locale}/login`}
          className="flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#0E6B58] px-6 text-sm font-bold text-white shadow-[0_14px_35px_rgba(14,107,88,0.22)] transition hover:bg-[#095746]"
        >
          <UserRound size={18} />
          {t("login")}
        </Link>
      </div>
    );
  };

  return (
    <div className="w-full bg-white/90">
      <header className="w-full border-y border-white/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(16,24,32,0.12)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[76px] items-center justify-between gap-4 lg:h-[88px]">
            <Link
              href={`/${locale}`}
              onClick={() => setMenuOpen(false)}
              className="flex shrink-0 items-center gap-3"
            >
              <div className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-[#0E6B58] to-[#101820] p-2 shadow-[0_16px_35px_rgba(14,107,88,0.25)] lg:h-[60px] lg:w-[60px]">
                {logo ? (
                  <Image
                    src={logo}
                    alt="العمران"
                    width={60}
                    height={60}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Building2 className="h-full w-full text-white" />
                )}
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg font-black leading-none text-[#101820]">
                  العمران
                </h1>
                <p className="mt-1 text-[11px] text-[#7B8B86]">
                  منصة العقارات الذكية
                </p>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <ul className="flex items-center gap-1 rounded-full border border-[#E3ECE8] bg-[#F4F8F6] p-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#40524C] transition hover:bg-white hover:text-[#0E6B58] hover:shadow-sm"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              {renderAuthButtons()}
              <LanguageSelector />
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#DCE6E2] bg-[#EEF6F3]"
                  >
                    <Image
                      src={profileImage}
                      alt="profile"
                      width={44}
                      height={44}
                      className="h-full w-full object-cover"
                    />
                  </button>

                  {mobileDropdownOpen && (
                    <UserDropdown
                      notificationsUnReadCount={notificationsUnReadCount}
                      onWalletClick={() => setWalletModalOpen(true)}
                      isOpen={mobileDropdownOpen}
                      locale={locale}
                      token={token}
                      onClose={() => setMobileDropdownOpen(false)}
                      isMobile
                      name={name}
                      role={role}
                    />
                  )}
                </div>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="flex h-11 items-center justify-center rounded-full bg-[#0E6B58] px-4 text-sm font-bold text-white"
                >
                  {t("login")}
                </Link>
              )}

              <button
                onClick={handleMenuToggle}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#101820] text-white"
                aria-label="menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div
              ref={menuRef}
              className="mb-4 rounded-[24px] border border-[#E3ECE8] bg-[#F7FAF8] p-4 shadow-inner lg:hidden"
            >
              <ul className="flex flex-col gap-2">
                {navLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-2xl border border-[#EDF3F0] bg-white px-4 py-3 text-sm font-bold text-[#101820]"
                      >
                        <Icon size={18} className="text-[#0E6B58]" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}

                {!isAuthenticated && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link
                      href={`/${locale}/register`}
                      onClick={() => setMenuOpen(false)}
                      className="flex h-12 items-center justify-center rounded-2xl border border-[#0E6B58]/25 bg-white text-sm font-bold text-[#0E6B58]"
                    >
                      {t("newAccount")}
                    </Link>

                    <Link
                      href={`/${locale}/login`}
                      onClick={() => setMenuOpen(false)}
                      className="flex h-12 items-center justify-center rounded-2xl bg-[#0E6B58] text-sm font-bold text-white"
                    >
                      {t("login")}
                    </Link>
                  </div>
                )}
              </ul>

              <div className="mt-4 flex justify-center">
                <LanguageSelector />
              </div>
            </div>
          )}
        </div>
      </header>

      {walletModalOpen && (
        <ConfirmWalletModal onClose={() => setWalletModalOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;