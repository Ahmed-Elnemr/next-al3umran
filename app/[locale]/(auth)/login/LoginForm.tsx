"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import apiServiceCall, { apiErrorMessage, apiFieldErrors, translateOrRaw } from "@/lib/apiServiceCall";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import CustomSelect from "@/components/shared/reusableComponents/CustomSelect";
import CountryPhoneInput from "@/components/shared/reusableComponents/CountryPhoneInput";
import OtpCode from "./OtpCode";

const loginSchema = z.object({
  phone: z.string().min(5, "mobile_invalid"),
  client_type: z.enum(["customer", "company"], {
    message: "client_type_required",
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const t = useTranslations("Login");
  const locale = useLocale();
  const isAr = locale === "ar";
  const [otpOpen, setOtpOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+971");

  const countries = [
    { code: "uae", label: isAr ? "الإمارات 🇦🇪" : "UAE 🇦🇪", prefix: "+971", flag: "🇦🇪" },
    { code: "syria", label: isAr ? "سوريا 🇸🇾" : "Syria 🇸🇾", prefix: "+963", flag: "🇸🇾" },
    { code: "iraq", label: isAr ? "العراق 🇮🇶" : "Iraq 🇮🇶", prefix: "+964", flag: "🇮🇶" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  React.useEffect(() => {
    if (typeof document !== "undefined" && document.cookie.includes("token=")) {
      window.location.href = `/${locale}`;
    }
  }, [locale]);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      client_type: "customer",
    },
  });

  const sendOtp = async (data: LoginFormData) => {
    const localPhone = data.phone.trim().replace(/\D/g, "");
    const response = await apiServiceCall({
      url: "client/auth/login",
      method: "POST",
      body: {
        client_type: data.client_type,
        country_code: selectedCountry.prefix,
        phone: localPhone,
      },
      headers: { "Accept-Language": locale, "X-Locale": locale },
    });
    return { response, localPhone, message: response?.message };
  };

  const loginMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: ({ localPhone, message }) => {
      setPhone(localPhone);
      setCountryCode(selectedCountry.prefix);
      setOtpOpen(true);
      toast.success(message || (isAr ? "تم إرسال رمز التحقق بنجاح" : "Verification code sent successfully"));
    },
    onError: (err: any) => {
      const fields = apiFieldErrors(err);
      Object.entries(fields).forEach(([key, message]) => {
        setError(key as keyof LoginFormData, { type: "server", message });
      });
      toast.error(apiErrorMessage(err, t("login_error") || (isAr ? "تعذر إرسال الرمز" : "Could not send verification code")));
    },
  });

  const resendOtp = async () => {
    try {
      const res = await apiServiceCall({
        url: "client/auth/resend-otp",
        method: "POST",
        body: {
          country_code: countryCode,
          phone,
          purpose: "login",
        },
        headers: { "Accept-Language": locale, "X-Locale": locale },
      });
      toast.success(res?.message || (isAr ? "تم إعادة إرسال الرمز" : "Verification code resent"));
    } catch (err: any) {
      toast.error(apiErrorMessage(err, isAr ? "تعذر إعادة الإرسال" : "Could not resend code"));
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit((data) => loginMutation.mutate(data))} className="flex w-full flex-col gap-4">
        <div>
          <label className={`mb-2 block text-sm font-bold text-gray-700 ${isAr ? "text-right" : "text-left"}`}>
            {isAr ? "الدولة ورقم الهاتف" : "Country & Phone Number"}
          </label>
          <CountryPhoneInput
            register={register}
            name="phone"
            placeholder={isAr ? "رقم الهاتف (مثال: 501234567)" : "Phone number (e.g. 501234567)"}
            countries={countries}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            locale={locale}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {translateOrRaw(t, errors.phone.message)}
            </p>
          )}
        </div>

        <div>
          <label className={`mb-2 block text-sm font-bold text-gray-700 ${isAr ? "text-right" : "text-left"}`}>
            {isAr ? "نوع المستخدم" : "User Type"}
          </label>
          <CustomSelect
            name="client_type"
            control={control}
            placeholder={t("select_client_type")}
            options={[
              { value: "customer", label: t("customer") },
              { value: "company", label: t("company") },
            ]}
          />
          {errors.client_type && (
            <p className="mt-1 text-sm text-red-600">
              {translateOrRaw(t, errors.client_type.message)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="mt-3 w-full rounded-xl bg-primary py-3.5 font-bold text-white transition duration-300 hover:bg-primary/80 disabled:opacity-70"
        >
          {loginMutation.isPending
            ? isAr
              ? "جاري إرسال الرمز..."
              : "Sending code..."
            : isAr
              ? "إرسال رمز التحقق"
              : "Send verification code"}
        </button>
      </form>

      <OtpCode
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        phone={phone}
        countryCode={countryCode}
        purpose="login"
        onResendCode={resendOtp}
      />
    </>
  );
};

export default LoginForm;
