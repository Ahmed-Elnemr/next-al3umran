"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import apiServiceCall, { apiErrorMessage } from "@/lib/apiServiceCall";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from "next-intl";
import { X, ShieldCheck, RefreshCw, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const OTP_LENGTH = 4;

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  countryCode: string;
  phone: string;
  token: string;
  formData: {
    name: string;
    email: string;
    phone: string;
    city_id: string;
  };
  onVerificationSuccess: () => void;
  onResendCode?: () => void;
}

const ConfirmMobile: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  countryCode,
  phone,
  token,
  formData,
  onVerificationSuccess,
  onResendCode,
}) => {
  const [uuid, setUuid] = useState("");
  const [deviceToken, setDeviceToken] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { handleSubmit, setValue, getValues, reset } = useForm();
  
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("otpCode");

  // Initialize device identifiers
  useEffect(() => {
    const initDeviceIdentifiers = () => {
      let storedUuid = localStorage.getItem("uuid");
      let storedDeviceToken = localStorage.getItem("device_token");

      if (!storedUuid) {
        storedUuid = uuidv4();
        localStorage.setItem("uuid", storedUuid);
      } else {
        storedUuid = storedUuid.startsWith('"') ? JSON.parse(storedUuid) : storedUuid;
      }

      if (!storedDeviceToken) {
        storedDeviceToken = uuidv4();
        localStorage.setItem("device_token", storedDeviceToken);
      } else {
        storedDeviceToken = storedDeviceToken.startsWith('"') ? JSON.parse(storedDeviceToken) : storedDeviceToken;
      }

      setUuid(storedUuid);
      setDeviceToken(storedDeviceToken);
    };

    initDeviceIdentifiers();
  }, []);

  // Countdown logic
  useEffect(() => {
    if (!isOpen) return;
    setCountdown(60);
    setCanResend(false);
    reset(); // clear inputs
  }, [isOpen, reset]);

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
      const response = await apiServiceCall({
        url: "client/profile/change-phone",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept-Language": locale,
          "X-Locale": locale,
        },
        body: JSON.stringify({
          country_code: countryCode,
          phone: phone,
          code,
        }),
      });

      if (!response) {
        throw new Error("No response from server");
      }
      return response;
    },
    onSuccess: async (res) => {
      if (res?.status || res?.status_code === "1000") {
        onVerificationSuccess();
      } else {
        toast.error(res?.message || (isAr ? "حدث خطأ أثناء التحقق" : "Verification failed"));
      }
    },
    onError: (error: any) => {
      console.error("Verification error:", error);
      toast.error(apiErrorMessage(error, isAr ? "كود التحقق غير صحيح" : "Invalid verification code"));
    },
  });

  const onSubmit = () => {
    const code = Array.from({ length: OTP_LENGTH }, (_, i) => getValues(`digit${i}`) || "").join("");
    if (code.length !== OTP_LENGTH) {
      toast.error(isAr ? `أدخل كود التحقق المكون من ${OTP_LENGTH} أرقام` : `Enter the ${OTP_LENGTH}-digit verification code`);
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
    } else {
      toast.info(isAr ? "تم إرسال كود جديد إلى هاتفك" : "New code sent to your phone");
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
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EEF6F3] text-[#0E6B58] shadow-inner">
            <ShieldCheck size={42} className="text-[#0E6B58] animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#080C22]">
              {t("title") || (isAr ? "رمز التحقق" : "Verification Code")}
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              {t("desc") || (isAr ? `أدخل الرمز المكون من ${OTP_LENGTH} أرقام المرسل إلى هاتفك` : `Enter the ${OTP_LENGTH}-digit code sent to your phone`)}
            </p>
          </div>

          {/* Phone Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 font-mono text-sm font-bold text-[#080C22]" dir="ltr">
            <span>{countryCode} {phone}</span>
          </div>

          {/* OTP Input Fields Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-3">
            <div className="flex items-center justify-center gap-2" dir="ltr" onPaste={handlePaste}>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  autoComplete="one-time-code"
                  autoFocus={i === 0}
                  className="h-14 w-12 rounded-2xl bg-[#F8FAFC] border-2 border-gray-200 text-center text-xl font-black text-[#080C22] transition-all duration-200 focus:border-[#0E6B58] focus:bg-white focus:ring-4 focus:ring-[#0E6B58]/10 outline-none shadow-sm"
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
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0E6B58] text-lg font-bold text-white shadow-lg shadow-[#0E6B58]/25 transition-all duration-200 hover:bg-[#095746] active:scale-[0.99] disabled:opacity-70"
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
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0E6B58] hover:text-[#095746] transition-colors duration-150"
              >
                <RefreshCw size={15} />
                <span>{isAr ? "إعادة إرسال الرمز الآن" : "Resend code now"}</span>
              </button>
            ) : (
              <p className="text-xs font-semibold text-gray-400">
                {isAr ? `يمكنك طلب رمز جديد بعد ` : `You can request another code in `}
                <span className="font-mono text-sm font-bold text-[#0E6B58]">{countdown}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMobile;
