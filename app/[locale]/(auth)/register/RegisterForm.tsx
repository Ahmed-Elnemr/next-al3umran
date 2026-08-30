'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast, ToastContainer } from 'react-toastify';
import Image from 'next/image';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import CountryPhoneInput from '@/components/shared/reusableComponents/CountryPhoneInput';
import apiServiceCall, { apiErrorMessage, apiFieldErrors, translateOrRaw } from '@/lib/apiServiceCall';
import { getCountries, getCities } from '@/lib/api/client';
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import FieldError from '@/components/shared/reusableComponents/FieldError';
import OtpCode from '../login/OtpCode';

import emailIcon from '@/public/images/register-email.png';
import userIcon from '@/public/images/register-user.png';
import locationIcon from '@/public/images/register-location.png';

const registerSchema = z.object({
  name: z.string().min(3, 'name_min_length'),
  phone: z.string().min(5, 'mobile_format'),
  email: z.string().email('invalid_email'),
  country_id: z.string().min(1, 'country_required'),
  city_id: z.string().min(1, 'city_required'),
  terms_accepted: z.literal(true, { errorMap: () => ({ message: 'terms_required' }) }),
  profile_image: z.any().optional(),
});

const getCountryPrefix = (item: any): string => {
  const raw = item?.phone_code ?? item?.calling_code ?? item?.dial_code ?? item?.country_code ?? item?.prefix;
  if (raw !== undefined && raw !== null && String(raw).trim() !== "") {
    const str = String(raw).trim();
    if (/^\+?\d+$/.test(str)) {
      return str.startsWith("+") ? str : `+${str}`;
    }
  }
  if (item?.code && /^\+?\d+$/.test(String(item.code).trim())) {
    const str = String(item.code).trim();
    return str.startsWith("+") ? str : `+${str}`;
  }
  const name = String(item?.name || item?.title || item?.code || "").toLowerCase();
  const idStr = String(item?.id || "");
  if (name.includes("سوريا") || name.includes("syria") || idStr === "2") return "+963";
  if (name.includes("عراق") || name.includes("iraq") || idStr === "3") return "+964";
  if (name.includes("إمارات") || name.includes("امارات") || name.includes("uae") || idStr === "1") return "+971";
  if (name.includes("سعودية") || name.includes("saudi")) return "+966";
  if (name.includes("مصر") || name.includes("egypt")) return "+20";
  return "+971";
};

const getCountryFlag = (item: any): string => {
  if (item?.flag && typeof item.flag === "string" && item.flag.trim()) return item.flag;
  const name = String(item?.name || item?.title || item?.code || "").toLowerCase();
  const idStr = String(item?.id || "");
  if (name.includes("سوريا") || name.includes("syria") || idStr === "2") return "🇸🇾";
  if (name.includes("عراق") || name.includes("iraq") || idStr === "3") return "🇮🇶";
  if (name.includes("إمارات") || name.includes("امارات") || name.includes("uae") || idStr === "1") return "🇦🇪";
  return "🚩";
};

const RegisterForm: React.FC = () => {
  const t = useTranslations('RegisterPage');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCountryCode, setOtpCountryCode] = useState('+971');

  const defaultCountries = [
    { id: '1', code: 'uae', label: isAr ? 'الإمارات 🇦🇪' : 'UAE 🇦🇪', prefix: '+971', flag: '🇦🇪' },
    { id: '2', code: 'syria', label: isAr ? 'سوريا 🇸🇾' : 'Syria 🇸🇾', prefix: '+963', flag: '🇸🇾' },
    { id: '3', code: 'iraq', label: isAr ? 'العراق 🇮🇶' : 'Iraq 🇮🇶', prefix: '+964', flag: '🇮🇶' }
  ];

  const [countriesList, setCountriesList] = useState<any[]>(defaultCountries);
  const [citiesList, setCitiesList] = useState<{ value: string; label: string }[]>([]);
  const [selectedCountryObj, setSelectedCountryObj] = useState(defaultCountries[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const renderErrorMessage = (errKey?: string) => {
    if (!errKey) return "";
    const translationsMap: Record<string, { ar: string; en: string }> = {
      name_min_length: {
        ar: "الاسم يجب أن يكون 3 أحرف على الأقل",
        en: "Name must be at least 3 characters",
      },
      invalid_email: {
        ar: "بريد إلكتروني غير صالح",
        en: "Invalid email address",
      },
      mobile_format: {
        ar: "أدخل رقم هاتف صحيح من 5 أرقام على الأقل",
        en: "Enter a valid phone number (at least 5 digits)",
      },
      country_required: {
        ar: "يجب اختيار الدولة",
        en: "Country selection is required",
      },
      city_required: {
        ar: "يجب اختيار المدينة",
        en: "City selection is required",
      },
      terms_required: {
        ar: "يجب الموافقة على الشروط والأحكام",
        en: "You must accept the terms and conditions",
      },
    };

    if (translationsMap[errKey]) {
      return isAr ? translationsMap[errKey].ar : translationsMap[errKey].en;
    }

    try {
      const translated = t(errKey);
      if (translated && !translated.includes("RegisterPage.")) return translated;
    } catch {}

    return translateOrRaw(t, errKey);
  };

  useEffect(() => {
    getCountries(locale)
      .then((res: any) => {
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
        if (data.length > 0) {
          const mapped = data.map((item: any) => {
            const prefix = getCountryPrefix(item);
            const flag = getCountryFlag(item);
            return {
              id: String(item.id),
              code: item.code || String(item.id),
              label: `${item.name || item.title} ${flag}`.trim(),
              prefix,
              flag,
            };
          });
          setCountriesList(mapped);
          setSelectedCountryObj(mapped[0]);
        }
      })
      .catch(() => {});
  }, [locale]);

  const { register, handleSubmit, control, watch, formState: { errors }, setValue, setError } =
    useForm({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        name: '',
        phone: '',
        email: '',
        country_id: '1',
        city_id: '',
        terms_accepted: false,
        profile_image: '',
      },
    });

  const selectedFormCountryId = watch("country_id");

  useEffect(() => {
    setValue('city_id', '');
    if (!selectedFormCountryId) return;

    const match = countriesList.find(
      (c) =>
        String(c.id) === String(selectedFormCountryId) ||
        String(c.code).toLowerCase() === String(selectedFormCountryId).toLowerCase()
    );
    if (match) setSelectedCountryObj(match);

    getCities(locale, selectedFormCountryId)
      .then((res: any) => {
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
        if (data.length > 0) {
          setCitiesList(
            data.map((city: any) => ({
              value: String(city.id),
              label: city.name || city.title,
            }))
          );
        } else {
          setFallbackCities(selectedFormCountryId);
        }
      })
      .catch(() => {
        setFallbackCities(selectedFormCountryId);
      });
  }, [selectedFormCountryId, locale, setValue, countriesList]);

  const setFallbackCities = (countryId: string) => {
    if (countryId === '1' || countryId === 'uae') {
      setCitiesList([
        { value: '1', label: isAr ? 'دبي' : 'Dubai' },
        { value: '2', label: isAr ? 'أبوظبي' : 'Abu Dhabi' },
        { value: '3', label: isAr ? 'الشارقة' : 'Sharjah' },
        { value: '4', label: isAr ? 'عجمان' : 'Ajman' },
      ]);
    } else if (countryId === '2' || countryId === 'syria') {
      setCitiesList([
        { value: '10', label: isAr ? 'دمشق' : 'Damascus' },
        { value: '11', label: isAr ? 'حلب' : 'Aleppo' },
        { value: '12', label: isAr ? 'حمص' : 'Homs' },
      ]);
    } else if (countryId === '3' || countryId === 'iraq') {
      setCitiesList([
        { value: '20', label: isAr ? 'بغداد' : 'Baghdad' },
        { value: '21', label: isAr ? 'أربيل' : 'Erbil' },
        { value: '22', label: isAr ? 'البصرة' : 'Basra' },
      ]);
    } else {
      setCitiesList([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profile_image', file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const registerMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return apiServiceCall({
        url: 'client/auth/register',
        method: 'POST',
        body: formData,
        headers: {
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });
    },
    onSuccess: (res, formData) => {
      const responseMessage = res?.message || (isAr ? 'تم إرسال رمز التحقق بنجاح' : 'Verification code sent successfully');
      toast.success(responseMessage);
      setOtpPhone(String(formData.get('phone') || ''));
      setOtpCountryCode(String(formData.get('country_code') || selectedCountryObj.prefix));
      setOtpOpen(true);
    },
    onError: (err: any) => {
      Object.entries(apiFieldErrors(err)).forEach(([key, message]) => {
        setError(key as any, { type: 'server', message });
      });
      toast.error(apiErrorMessage(err, t('register_error') || (isAr ? 'تعذر إنشاء الحساب' : 'Could not create account')));
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    const localPhone = data.phone.trim().replace(/\D/g, '');

    formData.append("client_type", "customer");
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("country_code", selectedCountryObj.prefix);
    formData.append("phone", localPhone);
    formData.append("country_id", String(data.country_id));
    formData.append("city_id", String(data.city_id));
    formData.append("terms_accepted", data.terms_accepted ? "1" : "0");

    if (data.profile_image instanceof File) {
      formData.append("profile_image", data.profile_image);
    }

    registerMutation.mutate(formData);
  };

  const resendOtp = async () => {
    try {
      const res = await apiServiceCall({
        url: 'client/auth/resend-otp',
        method: 'POST',
        body: {
          country_code: otpCountryCode,
          phone: otpPhone,
          purpose: 'register',
        },
        headers: { 'Accept-Language': locale, 'X-Locale': locale },
      });
      toast.success(res?.message || (isAr ? 'تم إعادة إرسال الرمز' : 'Verification code resent'));
    } catch (err: any) {
      toast.error(apiErrorMessage(err, isAr ? 'تعذر إعادة الإرسال' : 'Could not resend code'));
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto rounded-2xl grid lg:gap-6 gap-4 lg:grid-cols-2 grid-cols-1 mt-7 lg:mt-0"
      >
        {/* الاسم */}
        <div>
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'الاسم بالكامل' : 'Full Name'}
          </label>
          <InputComponent
            register={register}
            name="name"
            type="text"
            placeholder={t('name_placeholder')}
            icon={<Image src={userIcon} alt="" width={24} height={24} />}
          />
          <FieldError message={errors.name ? renderErrorMessage(errors.name.message) : undefined} />
        </div>

        {/* الموبايل والدولة */}
        <div>
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'رقم الهاتف' : 'Phone Number'}
          </label>
          
          <CountryPhoneInput
            register={register}
            name="phone"
            placeholder={isAr ? 'رقم الهاتف (مثال: 501234567)' : 'Phone number (e.g. 501234567)'}
            countries={countriesList}
            selectedCountry={selectedCountryObj}
            onCountryChange={(country) => {
              setSelectedCountryObj(country);
              setValue('country_id', String(country.id));
            }}
            locale={locale}
          />
          
          <FieldError message={errors.phone ? renderErrorMessage(errors.phone.message) : undefined} />
        </div>

        {/* البلد */}
        <div>
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'البلد' : 'Country'}
          </label>
          <CustomSelect
            name="country_id"
            control={control}
            options={countriesList.map((c) => ({ value: String(c.id), label: c.label }))}
            placeholder={isAr ? 'اختر البلد' : 'Select Country'}
            icon={<Image src={locationIcon} alt="" width={24} height={24} />}
          />
          <FieldError message={errors.country_id ? renderErrorMessage(errors.country_id.message) : undefined} />
        </div>

        {/* الايميل */}
        <div>
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'البريد الإلكتروني' : 'Email Address'}
          </label>
          <InputComponent
            register={register}
            name="email"
            type="email"
            placeholder={t('email_placeholder')}
            icon={<Image src={emailIcon} alt="" width={24} height={24} />}
          />
          <FieldError message={errors.email ? renderErrorMessage(errors.email.message) : undefined} />
        </div>

        {/* المدينة */}
        <div>
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'المدينة' : 'City'}
          </label>
          <CustomSelect
            name="city_id"
            control={control}
            options={citiesList}
            placeholder={t('city_placeholder')}
            icon={<Image src={locationIcon} alt="" width={24} height={24} />}
          />
          <FieldError message={errors.city_id ? renderErrorMessage(errors.city_id.message) : undefined} />
        </div>

        {/* رفع الصورة */}
        <div className="lg:col-span-2">
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'الصورة الشخصية' : 'Profile Image'}
          </label>
          <label
            htmlFor="profile_image"
            className="flex flex-col items-center justify-center w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary transition relative overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="" className="object-cover w-full h-full rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-sm text-gray-400 text-center">
                  {t('click_to_upload')} <br /> {t('or_drag_image_here')}
                </p>
              </div>
            )}

            <input
              id="profile_image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <FieldError message={errors.profile_image ? renderErrorMessage(errors.profile_image.message) : undefined} />
        </div>

        {/* الشروط */}
        <div className="lg:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="terms_accepted"
            {...register('terms_accepted')}
            className="h-5 w-5 text-primary rounded focus:ring"
          />
          <label htmlFor="terms_accepted" className="text-sm text-gray-500">
            {t('terms_agree')} <a href="#" className="text-primary underline">{t('terms_link')}</a>
          </label>
        </div>

        <div className="lg:col-span-2">
          <FieldError message={errors.terms_accepted ? renderErrorMessage(errors.terms_accepted.message) : undefined} />
        </div>

        {/* زر التسجيل */}
        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="bg-primary w-full text-white py-4 rounded-xl font-bold transition duration-300 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending
              ? (isAr ? 'جاري إرسال الرمز...' : 'Sending code...')
              : (isAr ? 'إرسال رمز التحقق' : 'Send verification code')}
          </button>
        </div>
      </form>

      <OtpCode
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        phone={otpPhone}
        countryCode={otpCountryCode}
        purpose="register"
        onResendCode={resendOtp}
      />
    </>
  );
};

export default RegisterForm;
