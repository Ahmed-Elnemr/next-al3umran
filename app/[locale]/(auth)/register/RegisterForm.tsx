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
import { z } from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import OtpCode from '../login/OtpCode';

import emailIcon from '@/public/images/register-email.png';
import userIcon from '@/public/images/register-user.png';
import locationIcon from '@/public/images/register-location.png';

const registerSchema = z.object({
  name: z.string().min(3, 'name_min_length'),
  phone: z.string().min(5, 'mobile_format'),
  email: z.string().email('invalid_email'),
  country: z.string().min(1, 'country_required'),
  city: z.string().min(1, 'city_required'),
  terms_accepted: z.literal(true, { errorMap: () => ({ message: 'terms_required' }) }),
  profile_image: z.any().optional(),
});

const RegisterForm: React.FC = () => {
  const t = useTranslations('RegisterPage');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCountryCode, setOtpCountryCode] = useState('+971');

  const countries = [
    { code: 'uae', label: isAr ? 'الإمارات 🇦🇪' : 'UAE 🇦🇪', prefix: '+971', flag: '🇦🇪' },
    { code: 'syria', label: isAr ? 'سوريا 🇸🇾' : 'Syria 🇸🇾', prefix: '+963', flag: '🇸🇾' },
    { code: 'iraq', label: isAr ? 'العراق 🇮🇶' : 'Iraq 🇮🇶', prefix: '+964', flag: '🇮🇶' }
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const getCityOptions = (countryCode: string) => {
    switch (countryCode) {
      case 'uae':
        return [
          { value: 'dubai', label: isAr ? 'دبي' : 'Dubai' },
          { value: 'abu_dhabi', label: isAr ? 'أبوظبي' : 'Abu Dhabi' },
          { value: 'sharjah', label: isAr ? 'الشارقة' : 'Sharjah' },
          { value: 'ajman', label: isAr ? 'عجمان' : 'Ajman' },
          { value: 'ras_al_khaimah', label: isAr ? 'رأس الخيمة' : 'Ras Al Khaimah' },
          { value: 'umm_al_quwain', label: isAr ? 'أم القيوين' : 'Umm Al Quwain' },
          { value: 'fujairah', label: isAr ? 'الفجيرة' : 'Fujairah' },
        ];
      case 'iraq':
        return [
          { value: 'baghdad', label: isAr ? 'بغداد' : 'Baghdad' },
          { value: 'basra', label: isAr ? 'البصرة' : 'Basra' },
          { value: 'erbil', label: isAr ? 'أربيل' : 'Erbil' },
          { value: 'mosul', label: isAr ? 'الموصل' : 'Mosul' },
          { value: 'sulaymaniyah', label: isAr ? 'السليمانية' : 'Sulaymaniyah' },
          { value: 'karbala', label: isAr ? 'كربلاء' : 'Karbala' },
          { value: 'najaf', label: isAr ? 'النجف' : 'Najaf' },
        ];
      case 'syria':
        return [
          { value: 'damascus', label: isAr ? 'دمشق' : 'Damascus' },
          { value: 'aleppo', label: isAr ? 'حلب' : 'Aleppo' },
          { value: 'homs', label: isAr ? 'حمص' : 'Homs' },
          { value: 'hama', label: isAr ? 'حماة' : 'Hama' },
          { value: 'latakia', label: isAr ? 'اللاذقية' : 'Latakia' },
          { value: 'tartus', label: isAr ? 'طرطوس' : 'Tartus' },
          { value: 'daraa', label: isAr ? 'درعا' : 'Daraa' },
        ];
      default:
        return [];
    }
  };

  const { register, handleSubmit, control, watch, formState: { errors }, setValue, setError } =
    useForm({
      resolver: zodResolver(registerSchema),
      defaultValues: {
        name: '',
        phone: '',
        email: '',
        country: 'uae',
        city: '',
        terms_accepted: false,
        profile_image: '',
      },
    });

  const selectedFormCountry = watch("country");

  useEffect(() => {
    setValue('city', '');
    const match = countries.find((country) => country.code === selectedFormCountry);
    if (match) setSelectedCountry(match);
  }, [selectedFormCountry, setValue]);

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
        url: 'auth/register',
        method: 'POST',
        body: formData,
        headers: {
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });
    },
    onSuccess: (_res, formData) => {
      setOtpPhone(String(formData.get('phone') || ''));
      setOtpCountryCode(String(formData.get('country_code') || selectedCountry.prefix));
      setOtpOpen(true);
      toast.success(t('otp_sent'));
    },
    onError: (err: any) => {
      Object.entries(apiFieldErrors(err)).forEach(([key, message]) => {
        setError(key as any, { type: 'server', message });
      });
      toast.error(apiErrorMessage(err, t('register_error')));
    },
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    const localPhone = data.phone.replace(/\D/g, '').replace(/^0+/, '');

    formData.append("client_type", "customer");
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", localPhone);
    formData.append("country_code", selectedCountry.prefix);
    formData.append("country", data.country);
    formData.append("city", data.city);
    formData.append("terms_accepted", data.terms_accepted ? "1" : "0");

    if (data.profile_image instanceof File) {
      formData.append("profile_image", data.profile_image);
    }

    registerMutation.mutate(formData);
  };

  const resendOtp = async () => {
    try {
      await apiServiceCall({
        url: 'auth/resend-otp',
        method: 'POST',
        body: {
          phone: otpPhone,
          country_code: otpCountryCode,
          purpose: 'register',
        },
        headers: { 'Accept-Language': locale, 'X-Locale': locale },
      });
      toast.success(t('otp_sent'));
    } catch (err: any) {
      toast.error(apiErrorMessage(err, isAr ? 'تعذر إعادة الإرسال' : 'Could not resend code'));
    }
  };

  return (
    <>
      <ToastContainer />

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
          {errors.name && <p className="text-sm text-red-600 mt-1">{translateOrRaw(t, errors.name.message)}</p>}
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
            countries={countries}
            selectedCountry={selectedCountry}
            onCountryChange={(country) => {
              setSelectedCountry(country);
              setValue('country', country.code);
            }}
            locale={locale}
          />
          
          {errors.phone && <p className="text-sm text-red-600 mt-1">{translateOrRaw(t, errors.phone.message)}</p>}
        </div>

        {/* البلد */}
        <div>
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'البلد' : 'Country'}
          </label>
          <CustomSelect
            name="country"
            control={control}
            options={[
              { value: 'uae', label: isAr ? 'الإمارات' : 'UAE' },
              { value: 'syria', label: isAr ? 'سوريا' : 'Syria' },
              { value: 'iraq', label: isAr ? 'العراق' : 'Iraq' },
            ]}
            placeholder={isAr ? 'اختر البلد' : 'Select Country'}
            icon={<Image src={locationIcon} alt="" width={24} height={24} />}
          />
          {errors.country && <p className="text-sm text-red-600 mt-1">{translateOrRaw(t, errors.country.message)}</p>}
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
          {errors.email && <p className="text-sm text-red-600 mt-1">{translateOrRaw(t, errors.email.message)}</p>}
        </div>

        {/* المدينة */}
        <div>
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'المدينة' : 'City'}
          </label>
          <CustomSelect
            name="city"
            control={control}
            options={getCityOptions(selectedFormCountry || selectedCountry.code)}
            placeholder={t('city_placeholder')}
            icon={<Image src={locationIcon} alt="" width={24} height={24} />}
          />
          {errors.city && <p className="text-sm text-red-600 mt-1">{translateOrRaw(t, errors.city.message)}</p>}
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
          {errors.profile_image && (
            <p className="text-sm text-red-600 mt-1">{translateOrRaw(t, errors.profile_image.message)}</p>
          )}
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

        {errors.terms_accepted && (
          <p className="text-sm text-red-600 lg:col-span-2 mt-1">
            {translateOrRaw(t, errors.terms_accepted.message)}
          </p>
        )}

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
