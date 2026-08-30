"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Bell,
  Edit3,
  LogOut,
  Ticket,
  Trash2,
  UserRound,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Building2,
} from "lucide-react";

import LogoutModal from "./LogoutModal";
import DeleteAccountModal from "./DeleteAccountModal";
import apiServiceCall from "../../lib/apiServiceCall";

interface UserDropdownProps {
  isOpen: boolean;
  locale: string;
  onClose: () => void;
  token?: string;
  name?: string;
  role?: string;
  isMobile?: boolean;
  onWalletClick?: () => void;
  notificationsUnReadCount: any;
  onLogoutTrigger?: () => void;
  buttonRef?: React.RefObject<any>;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  isOpen,
  locale,
  onClose,
  token,
  name,
  role,
  notificationsUnReadCount,
  buttonRef,
  onWalletClick,
  onLogoutTrigger,
}) => {
  const tn = useTranslations("navbar");
  const t = useTranslations("UserDropdown");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;
  
  const [localUnreadCount, setLocalUnreadCount] = useState(Number(notificationsUnReadCount || 0));

  useEffect(() => {
    if (isOpen && token) {
      const fetchUnreadCount = async () => {
        try {
          const res = await apiServiceCall({
            method: 'get',
            url: 'client/notifications/unread-count',
            headers: {
              'Accept-Language': locale,
              Authorization: `Bearer ${token}`,
            },
          });
          if (res?.data?.unread_count !== undefined) {
            setLocalUnreadCount(Number(res.data.unread_count));
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      };
      fetchUnreadCount();
    }
  }, [isOpen, token, locale]);

  const closeDropdown = () => {
    setShowDeleteModal(false);
    onClose();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    closeDropdown();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !dropdownRef.current?.contains(target) &&
        !deleteModalRef.current?.contains(target)
      ) {
        closeDropdown();
      }
    };

    if (isOpen || showDeleteModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showDeleteModal]);

  if (!isOpen) return null;

  const itemClass =
    "group w-full px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-[#263832] hover:bg-[#EEF6F3] transition";

  const contentClass = "flex items-center gap-3";

  return (
    <>
      <div
        ref={dropdownRef}
        dir={isAr ? "rtl" : "ltr"}
        className={`absolute top-[calc(100%+12px)] ${isAr ? "left-0" : "right-0"
          } w-[285px] rounded-[26px] border border-[#E2ECE8] bg-white shadow-[0_22px_70px_rgba(16,24,32,0.18)] p-3 z-[100]`}
      >
        <div className="rounded-[22px] bg-gradient-to-br from-[#0E6B58] to-[#101820] p-4 text-white mb-3 overflow-hidden relative">
          <div className="absolute -top-10 -end-8 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -start-8 w-24 h-24 rounded-full bg-[#C89B3C]/20" />

          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
              <UserRound size={22} />
            </div>

            <div>
              <p className="text-xs text-white/70">{tn("welcome")}</p>
              <h3 className="text-sm font-black max-w-[170px] truncate">
                {name || (isAr ? "مستخدم العمران" : "Al Omran User")}
              </h3>
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-1 text-sm">
          <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/edit-data`}
              className={itemClass}
            >
              <span className={contentClass}>
                <span className="w-10 h-10 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center">
                  <Edit3 size={18} />
                </span>
                <span className="font-bold">{t("editProfile")}</span>
              </span>
              <ArrowIcon size={16} className="text-[#9BAAA5]" />
            </Link>
          </li>

          <li>
            <Link
              onClick={closeDropdown}
              href={`/${locale}/notifications`}
              prefetch={false}
              className={itemClass}
            >
              <span className={contentClass}>
                <span className="w-10 h-10 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center">
                  <Bell size={18} />
                </span>
                <span className="font-bold">{t("notifications")}</span>
              </span>

              <span className="flex items-center gap-2">
                <span className={`min-w-6 h-6 px-1.5 rounded-full text-xs font-black flex items-center justify-center ${localUnreadCount > 0 ? 'bg-red-500 text-white' : 'bg-[#E2ECE8] text-[#7B8B86]'}`}>
                  {localUnreadCount}
                </span>
                <ArrowIcon size={16} className="text-[#9BAAA5]" />
              </span>
            </Link>
          </li>

          {role === "company" && (
            <li>
              <Link
                onClick={closeDropdown}
                href={`/${locale}/wallet`}
                className={itemClass}
              >
                <span className={contentClass}>
                  <span className="w-10 h-10 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center">
                    <Wallet size={18} />
                  </span>
                  <span className="font-bold">{t("wallet")}</span>
                </span>
                <ArrowIcon size={16} className="text-[#9BAAA5]" />
              </Link>
            </li>
          )}

          {role === "company" && (
            <li>
              <Link
                onClick={closeDropdown}
                href={`/${locale}/packages`}
                className={itemClass}
              >
                <span className={contentClass}>
                  <span className="w-10 h-10 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center">
                    <Ticket size={18} />
                  </span>
                  <span className="font-bold">
                    {locale === "ar" ? "باقات الاشتراك" : "Subscriptions"}
                  </span>
                </span>
                <ArrowIcon size={16} className="text-[#9BAAA5]" />
              </Link>
            </li>
          )}

          {role === "company" && (
            <li>
              <Link
                onClick={closeDropdown}
                href={`/${locale}/my-properties`}
                className={itemClass}
              >
                <span className={contentClass}>
                  <span className="w-10 h-10 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center">
                    <Building2 size={18} />
                  </span>
                  <span className="font-bold">
                    {locale === "ar" ? "عقاراتي" : "My Properties"}
                  </span>
                </span>
                <ArrowIcon size={16} className="text-[#9BAAA5]" />
              </Link>
            </li>
          )}

          <li className="pt-2 mt-2 border-t border-[#EDF3F0]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeDropdown();
                if (onLogoutTrigger) onLogoutTrigger();
              }}
              className="w-full px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-[#B42318] hover:bg-[#FFF2F1] transition"
            >
              <span className={contentClass}>
                <span className="w-10 h-10 rounded-2xl bg-[#FFF2F1] text-[#B42318] flex items-center justify-center">
                  <LogOut size={18} />
                </span>
                <span className="font-bold">{t("logout")}</span>
              </span>
            </button>
          </li>

          {/* لو احتجت زر حذف الحساب بعدين، شيله من الكومنت */}
          {false && (
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-[#B42318] hover:bg-[#FFF2F1] transition"
              >
                <Trash2 size={18} />
                <span>{t("deleteAccount")}</span>
              </button>
            </li>
          )}
        </ul>
      </div>

      {showDeleteModal && (
        <div ref={deleteModalRef}>
          <DeleteAccountModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteAccount}
            token={token}
          />
        </div>
      )}
    </>
  );
};

export default UserDropdown;