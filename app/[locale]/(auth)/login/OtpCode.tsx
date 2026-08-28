"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import otpCodeImg from "@/public/images/otp-code.png";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import apiServiceCall, { apiErrorMessage } from "@/lib/apiServiceCall";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import { X, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";

const OTP_LENGTH = 4;

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  countryCode: string;
  purpose: "login" | "register";
  onResendCode?: () => void;
}

const persistSession = async (locale: string, payload: any, mobile: string) => {
  const tokenResponse = await fetch("/api/auth/set-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": locale,
    },
    body: JSON.stringify({
      token: payload.token,
      userId: payload.user?.id,
      userDataInfo: payload.user,
      mobile,
      userType: payload.user?.client_type || "customer",
    }),
  });

  if (!tokenResponse.ok) {
    throw new Error("Failed to store token");
  }
};

const OtpCode: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  phone,
  countryCode,
  purpose,
  onResendCode,
}) => {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { handleSubmit, setValue, getValues } = useForm();
  const locale = useLocale();
  const t = useTranslations("otpCode");
  const isAr = locale === "ar";
  const displayPhone = `${countryCode} ${phone}`;

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(60);
    setCanResend(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || countdown <= 0) {
      if (countdown === 0) setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isOpen]);

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiServiceCall({
        url: "client/auth/verify-otp",
        method: "POST",
        body: {
          country_code: countryCode,
          phone,
          code,
          purpose,
          device_type: "web",
        },
        headers: { "Accept-Language": locale, "X-Locale": locale },
      });
    },
    onSuccess: async (res) => {
      const payload = res?.data || res;
      const user = payload?.user?.data ?? payload?.user;
      if (!payload?.token) {
        toast.error(res?.message || (isAr ? "فشل التحقق" : "Verification failed"));
        return;
      }

      await persistSession(locale, { ...payload, user }, displayPhone);
      toast.success(res?.message || (isAr ? "تم التحقق بنجاح" : "Verified successfully"));
      window.location.href = `/${locale}`;
    },
    onError: (error: any) => {
      toast.error(apiErrorMessage(error, isAr ? "كود التحقق غير صحيح" : "Invalid verification code"));
    },
  });

  const onSubmit = () => {
    const code = Array.from({ length: OTP_LENGTH }, (_, i) => getValues(`digit${i}`) || "").join("");
    if (code.length !== OTP_LENGTH) {
      toast.error(isAr ? "أدخل كود التحقق المكون من 4 أرقام" : "Enter the 4-digit verification code");
      return;
    }
    verifyMutation.mutate(code);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    setValue(`digit${index}`, value);
    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    if (index === OTP_LENGTH - 1 && value) {
      handleSubmit(onSubmit)();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    pasteData.split("").forEach((char, i) => {
      setValue(`digit${i}`, char);
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = char;
      }
    });
    if (pasteData.length === OTP_LENGTH) {
      handleSubmit(onSubmit)();
    }
  };

  const handleResendCode = () => {
    if (!canResend) return;
    if (onResendCode) {
      onResendCode();
    }
    setCountdown(60);
    setCanResend(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-gray-100 transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center gap-4 text-center mt-2">
          {/* Visual Header Image Badge */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EEF6F3] text-primary shadow-inner">
            <ShieldCheck size={42} className="text-primary animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#080C22]">{t("title") || (isAr ? "رمز التحقق" : "Verification Code")}</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {t("desc") || (isAr ? "أدخل الرمز المكون من 4 أرقام المرسل إلى هاتفك" : "Enter the 4-digit code sent to your phone")}
            </p>
          </div>

          {/* Phone Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 font-mono text-sm font-bold text-[#080C22]" dir="ltr">
            <span>{displayPhone}</span>
          </div>

          {/* OTP Input Fields Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-3">
            <div className="flex items-center justify-center gap-3" dir="ltr" onPaste={handlePaste}>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="one-time-code"
                  autoFocus={i === 0}
                  className="h-16 w-14 rounded-2xl bg-[#F8FAFC] border-2 border-gray-200 text-center text-2xl font-black text-[#080C22] transition-all duration-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 outline-none shadow-sm"
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !e.currentTarget.value && i > 0) {
                      inputsRef.current[i - 1]?.focus();
                    }
                  }}
                />
              ))}
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 active:scale-[0.99] disabled:opacity-70"
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  <span>{isAr ? "جاري التحقق..." : "Verifying..."}</span>
                </>
              ) : (
                <span>{isAr ? "تأكيد والتحقق" : "Verify Code"}</span>
              )}
            </button>
          </form>

          {/* Countdown / Resend Section */}
          <div className="mt-1 text-center">
            {canResend ? (
              <button
                onClick={handleResendCode}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors duration-150"
              >
                <RefreshCw size={15} />
                <span>{isAr ? "إعادة إرسال الرمز الآن" : "Resend code now"}</span>
              </button>
            ) : (
              <p className="text-xs font-semibold text-gray-400">
                {isAr ? `يمكنك طلب رمز جديد بعد ` : `You can request another code in `}
                <span className="font-mono text-sm font-bold text-primary">{countdown}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpCode;
