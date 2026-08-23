"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import otpCodeImg from "@/public/images/otp-code.png";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import apiServiceCall, { apiErrorMessage } from "@/lib/apiServiceCall";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";

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
  const displayPhone = `${countryCode}${phone}`;

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
        url: "auth/verify-otp",
        method: "POST",
        body: {
          phone,
          country_code: countryCode,
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
      toast.success(isAr ? "تم التحقق بنجاح" : "Verified successfully");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-[95%] max-w-md rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 end-4 flex h-7 w-7 items-center justify-center rounded-full border text-lg text-gray-500"
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className="mt-6 flex flex-col items-center gap-4">
          <Image src={otpCodeImg} alt="OTP Code" width={91} height={188} priority />
          <h2 className="text-[22px] font-bold text-primary">{t("title")}</h2>
          <p className="text-center text-base text-[#989898]">{t("desc")}</p>
          <h5 className="text-sm font-medium text-[#080C22]">{displayPhone}</h5>
          <p className="text-xs font-bold text-[#0E6B58]">
            {isAr ? "الكود التجريبي حالياً: 1111" : "Temporary test code: 1111"}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} dir="ltr" className="w-full">
            <div className="mt-4 flex items-center justify-center gap-3" onPaste={handlePaste}>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="one-time-code"
                  autoFocus={i === 0}
                  className="h-14 w-12 rounded-2xl bg-[#f5f5f5] text-center text-2xl outline-none focus:ring-2 focus:ring-primary"
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
            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="mt-5 h-14 w-full rounded-2xl bg-primary text-lg text-white disabled:opacity-70"
            >
              {verifyMutation.isPending
                ? isAr
                  ? "جاري التحقق..."
                  : "Verifying..."
                : isAr
                  ? "تحقق"
                  : "Verify"}
            </button>
          </form>

          <div className="mt-2 text-center">
            {canResend ? (
              <button onClick={handleResendCode} className="text-sm font-medium text-primary hover:underline">
                {isAr ? "إعادة إرسال الكود" : "Resend code"}
              </button>
            ) : (
              <span className="text-sm text-[#989898]">
                {isAr ? `يمكنك طلب كود آخر بعد ${countdown}` : `You can request another code in ${countdown}s`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpCode;
