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
  Heart,
  Briefcase,
} from "lucide-react";

import LanguageSelector from "./LanguageSwitcher";
import UserDropdown from "./UserDropdown";
import LogoutModal from "./LogoutModal";
import apiServiceCall from "../../lib/apiServiceCall";

interface NavbarProps {
  token?: string;
  bank_account?: any;
  logo?: string;
  favicon?: string;
  siteName?: string;
  siteName?: string;
  tagline?: string;
  role?: string;
  userData?: any;
  notificationsUnReadCount: number;
}

const Navbar = ({
  token,
  logo,
  favicon,
  siteName,
  tagline,
  role,
  userData,
  notificationsUnReadCount,
}: NavbarProps) => {
  const locale = useLocale();
  const isAr = locale === "ar";

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const getAvatarUrl = (user: any): string => {
    if (!user) return "";
    return (
      user.profile_image ||
      user.profile_image_url ||
      user.avatar ||
      user.image ||
      user.media?.[0]?.url ||
      ""
    );
  };

  const [name, setName] = useState<string | undefined>(
    userData?.name || (typeof userData?.company_name === "string" ? userData.company_name : "")
  );
  const [profileImage, setProfileImage] = useState<string>(getAvatarUrl(userData));

  useEffect(() => {
    if (userData) {
      setName(userData.name || userData.company_name || "");
      setProfileImage(getAvatarUrl(userData));
    } else if (typeof window !== "undefined") {
      try {
        const cookieStr = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userDataInfo="))
          ?.split("=")[1];
        if (cookieStr) {
          const parsed = JSON.parse(decodeURIComponent(cookieStr));
          if (parsed) {
            setName(parsed.name || parsed.company_name || "");
            setProfileImage(getAvatarUrl(parsed));
          }
        }
      } catch (e) {}
    }
  }, [userData]);

  const t = useTranslations("navbar");
  const isAuthenticated = !!token;

  const displayName = name || (isAr ? "مستخدم" : "User");
  const avatarSrc = profileImage || "/images/register-user.png";

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

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
      href: `/${locale}/properties`,
      label: isAr ? "العقارات" : "Properties",
      icon: Building2,
    },
    {
      href: `/${locale}/companies`,
      label: isAr ? "الشركات" : "Companies",
      icon: Briefcase,
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
      // Direct local storage check for instant mockup rendering
      if (typeof window !== 'undefined') {
        const cachedUserStr = localStorage.getItem("alomran_current_user");
        if (cachedUserStr) {
          try {
            const cachedUser = JSON.parse(cachedUserStr);
            setName(cachedUser?.name || cachedUser?.company_name || "");
            setProfileImage(cachedUser?.profile_image_url || "");
          } catch (e) {
            console.error("Failed to parse local storage user", e);
          }
        }
      }

      if (!token) return;

      try {
        const response = await apiServiceCall({
          method: "GET",
          url: "client/profile",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const user = response?.data?.user ?? response?.data;
        setName(user?.name || user?.company_name || "");
        setProfileImage(user?.avatar || user?.profile_image_url || "");
      } catch (error) {
        console.warn("Failed to fetch user profile from API, trying cookie fallback...");
        const getCookie = (cname: string) => {
          if (typeof window === 'undefined') return "";
          const nameEQ = cname + "=";
          const ca = document.cookie.split(';');
          for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
          }
          return "";
        };

        const cachedUserStr = getCookie("userDataInfo");
        if (cachedUserStr) {
          try {
            // Decodes URL encoded cookie strings cleanly
            const decoded = decodeURIComponent(cachedUserStr);
            const cachedUser = JSON.parse(decoded);
            setName(cachedUser?.name || cachedUser?.company_name || "");
            setProfileImage(cachedUser?.avatar || cachedUser?.profile_image_url || "");
          } catch (e) {
            console.error("Failed to parse cached user cookie", e);
          }
        }
      }
    };

    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    const iconHref = favicon || logo;
    if (!iconHref) return;

    let link: HTMLLinkElement | null =
      document.querySelector("link[rel~='icon']");

    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    link.href = iconHref;
  }, [favicon, logo]);

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
              href={`/${locale}/add-your-property`}
              className="flex h-[48px] items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-5 text-sm font-bold text-[#101820] shadow-[0_14px_35px_rgba(200,155,60,0.28)] transition hover:-translate-y-0.5"
            >
              <PlusCircle size={18} />
              <span>{t("sellTicket")}</span>
            </Link>
          )}

          <Link
            href={`/${locale}/favorites`}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-[#DCE6E2] bg-white/90 text-[#0E6B58] shadow-sm transition hover:bg-[#EEF6F3]"
            title={isAr ? "المفضلة" : "Favorites"}
          >
            <Heart size={20} />
          </Link>

          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex h-[50px] min-w-[190px] items-center justify-between gap-3 rounded-full border border-[#DCE6E2] bg-white/90 px-3 text-[#101820] shadow-sm transition hover:border-[#0E6B58]/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#DCE6E2] bg-[#EEF6F3]">
                  <Image
                    src={avatarSrc}
                    width={36}
                    height={36}
                    alt="user"
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className={isAr ? "text-right" : "text-left"}>
                  <p className="text-[11px] text-[#7B8B86]">{t("welcome")}</p>
                  <p className="max-w-[92px] truncate text-xs font-bold text-[#101820]">
                    {displayName}
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
              name={displayName}
              role={role}
              buttonRef={buttonRef}
              onLogoutTrigger={() => setLogoutModalOpen(true)}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="hidden items-center gap-3 lg:flex">
        <Link
          href={`/${locale}/favorites`}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[#DCE6E2] bg-white/90 text-[#0E6B58] shadow-sm transition hover:bg-[#EEF6F3]"
          title={isAr ? "المفضلة" : "Favorites"}
        >
          <Heart size={20} />
        </Link>

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
    <div className="relative z-50 w-full bg-white/90">
      <header className="w-full border-y border-white/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(16,24,32,0.12)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[76px] items-center justify-between gap-4 lg:h-[88px]">
            <Link
              href={`/${locale}`}
              onClick={() => setMenuOpen(false)}
              className="flex shrink-0 items-center gap-3"
            >
              {logo ? (
                <span className="flex h-[52px] max-w-[200px] items-center lg:h-[60px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={siteName || (isAr ? "العمران" : "Al Omran")}
                    className="h-full w-auto max-w-[200px] object-contain"
                  />
                </span>
              ) : (
                <div className="h-[52px] w-[52px] rounded-2xl bg-gradient-to-br from-[#0E6B58] to-[#101820] p-2 shadow-[0_16px_35px_rgba(14,107,88,0.25)] lg:h-[60px] lg:w-[60px]">
                  <Building2 className="h-full w-full text-white" />
                </div>
              )}

            </Link>

            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <ul className="flex items-center gap-1 rounded-full border border-[#E3ECE8] bg-[#F4F8F6] p-1">
                {navLinks.filter(item => !(role === 'company' && item.href === `/${locale}/companies`)).map((item) => {
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
                    ref={mobileButtonRef}
                    onClick={() => setMobileDropdownOpen((prev) => !prev)}
                    className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[#DCE6E2] bg-[#EEF6F3]"
                  >
                    <Image
                      src={avatarSrc}
                      alt="profile"
                      width={44}
                      height={44}
                      unoptimized
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
                      name={displayName}
                      role={role}
                      buttonRef={mobileButtonRef}
                      onLogoutTrigger={() => setLogoutModalOpen(true)}
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
                {navLinks.filter(item => !(role === 'company' && item.href === `/${locale}/companies`)).map((item) => {
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

                <li>
                  <Link
                    href={`/${locale}/favorites`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-2xl border border-[#EDF3F0] bg-white px-4 py-3 text-sm font-bold text-[#101820]"
                  >
                    <Heart size={18} className="text-[#0E6B58]" />
                    {isAr ? "المفضلة" : "Favorites"}
                  </Link>
                </li>

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

      {logoutModalOpen && (
        <LogoutModal
          isOpen={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          token={token || ""}
        />
      )}
    </div>
  );
};

export default Navbar;