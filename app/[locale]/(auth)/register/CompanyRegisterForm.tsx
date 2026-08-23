'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import CountryPhoneInput from '@/components/shared/reusableComponents/CountryPhoneInput';
import Image from 'next/image';
import user from '@/public/images/register-user.png';
import email from '@/public/images/register-email.png';
import location from '@/public/images/register-location.png';
import check from '@/public/images/register-check.png';
import { useTranslations, useLocale } from 'next-intl';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiServiceCall, { apiErrorMessage, apiFieldErrors, translateOrRaw } from '@/lib/apiServiceCall';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import OtpCode from '../login/OtpCode';

// ------------------------- Schema Validation ---------------------------
const companyRegisterSchema = z.object({
  company_name: z.string().min(3, "company_name_required"),
  email: z.string().email("email_invalid"),
  phone: z.string().min(5, 'mobile_format'),
  country: z.string().min(1, "country_required"),
  city: z.string().min(1, "city_required"),
  commercial_register: z.string().min(3, "commercial_register_required"),
  company_bio: z.string().min(10, "company_bio_required"),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: "terms_accepted_required",
  }),
  profile_image: z.any().optional(),
});

type CompanyRegisterFormData = z.infer<typeof companyRegisterSchema>;

const CompanyRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCountryCode, setOtpCountryCode] = useState('+971');
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === 'ar';

  const countries = [
    { code: 'uae', label: isAr ? 'الإمارات 🇦🇪' : 'UAE 🇦🇪', prefix: '+971', flag: '🇦🇪' },
    { code: 'syria', label: isAr ? 'سوريا 🇸🇾' : 'Syria 🇸🇾', prefix: '+963', flag: '🇸🇾' },
    { code: 'iraq', label: isAr ? 'العراق 🇮🇶' : 'Iraq 🇮🇶', prefix: '+964', flag: '🇮🇶' }
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<CompanyRegisterFormData>({
    resolver: zodResolver(companyRegisterSchema),
    defaultValues: {
      company_name: "",
      email: "",
      phone: "",
      country: "uae",
      city: "",
      commercial_register: "",
      company_bio: "",
      terms_accepted: false,
    },
  });

  const selectedFormCountry = watch("country");

  useEffect(() => {
    setValue('city', '');
    const match = countries.find((country) => country.code === selectedFormCountry);
    if (match) setSelectedCountry(match);
  }, [selectedFormCountry, setValue]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setValue('profile_image', file);
    }
  };

  const onSubmit = async (data: CompanyRegisterFormData) => {
    setIsLoading(true);
    const localPhone = data.phone.replace(/\D/g, '').replace(/^0+/, '');

    try {
      const formData = new FormData();
      formData.append('client_type', 'company');
      formData.append('company_name', data.company_name);
      formData.append('email', data.email);
      formData.append('phone', localPhone);
      formData.append('country_code', selectedCountry.prefix);
      formData.append('country', data.country);
      formData.append('city', data.city);
      formData.append('commercial_register', data.commercial_register);
      formData.append('company_bio', data.company_bio);
      formData.append('terms_accepted', '1');

      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }

      await apiServiceCall({
        url: 'auth/register',
        method: 'POST',
        body: formData,
        headers: {
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });

      setOtpPhone(localPhone);
      setOtpCountryCode(selectedCountry.prefix);
      setOtpOpen(true);
      toast.success(isAr ? 'تم إرسال رمز التحقق' : 'Verification code sent');
    } catch (error: any) {
      Object.entries(apiFieldErrors(error)).forEach(([key, message]) => {
        setError(key as keyof CompanyRegisterFormData, { type: 'server', message });
      });
      toast.error(apiErrorMessage(error, t('registration_error') || (isAr ? 'تعذر إنشاء الحساب' : 'Could not create account')));
    } finally {
      setIsLoading(false);
    }
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
      toast.success(isAr ? 'تم إعادة إرسال الرمز' : 'Code resent');
    } catch (error: any) {
      toast.error(apiErrorMessage(error, isAr ? 'تعذر إعادة الإرسال' : 'Could not resend code'));
    }
  };

  return (
    <div className="relative">
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* اسم الشركة */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'اسم الشركة / البائع' : 'Seller / Company Name'}
            </label>
            <InputComponent
              register={register}
              name="company_name"
              placeholder={t('company_name_placeholder')}
              type="text"
              icon={<Image src={user} alt="" width={24} height={24} />}
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.company_name.message)}</p>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <InputComponent
              register={register}
              name="email"
              placeholder={t('email_placeholder')}
              type="email"
              icon={<Image src={email} alt="" width={24} height={24} />}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.email.message)}</p>
            )}
          </div>

          {/* رقم الجوال مع اختيار الدولة */}
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
            
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.phone.message)}</p>
            )}
          </div>

          {/* اختيار البلد */}
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
              icon={<Image src={location} alt="" width={24} height={24} />}
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.country.message)}</p>
            )}
          </div>

          {/* اختيار المدينة */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'المدينة' : 'City'}
            </label>
            <CustomSelect
              name="city"
              control={control}
              options={getCityOptions(selectedFormCountry || selectedCountry.code)}
              placeholder={t('city_placeholder')}
              icon={<Image src={location} alt="" width={24} height={24} />}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.city.message)}</p>
            )}
          </div>

          {/* رقم السجل التجاري */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'رقم السجل التجاري' : 'Commercial Register Number'}
            </label>
            <InputComponent
              register={register}
              name="commercial_register"
              placeholder={t('commercial_register_placeholder')}
              type="text"
              icon={<Image src={check} alt="" width={24} height={24} />}
            />
            {errors.commercial_register && (
              <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.commercial_register.message)}</p>
            )}
          </div>

          {/* نبذة عن الشركة */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'نبذة عن الشركة / أعمالك' : 'Company Bio'}
            </label>
            <InputComponent
              register={register}
              name="company_bio"
              placeholder={t('company_bio_placeholder')}
              type="text"
              icon={<Image src={check} alt="" width={24} height={24} />}
            />
            {errors.company_bio && (
              <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.company_bio.message)}</p>
            )}
          </div>

        </div>

        {/* تحميل الصورة */}
        <div className="w-full">
          <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
            {isAr ? 'صورة الشعار أو الهوية' : 'Logo or Identity Image'}
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#E3ECE8] hover:border-[#0E6B58] bg-[#F7FAF8] rounded-2xl cursor-pointer transition relative overflow-hidden">
              {selectedImage ? (
                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="text-sm text-gray-500">{t('drag_or_click_here')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('image_size_format')}</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {errors.profile_image && (
            <p className="mt-1 text-sm text-red-600">{translateOrRaw(t, errors.profile_image.message)}</p>
          )}
        </div>

        {/* الموافقة على الشروط */}
        <div className="flex items-start gap-3">
          <Controller
            name="terms_accepted"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="terms_accepted"
                checked={field.value}
                onChange={field.onChange}
                className="h-5 w-5 rounded border-[#DCE6E2] text-[#0E6B58] focus:ring-[#0E6B58]"
              />
            )}
          />
          <label htmlFor="terms_accepted" className="text-sm text-gray-500">
            {isAr ? 'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بالمنصة' : 'I agree to the Terms and Privacy Policy'}
          </label>
        </div>
        {errors.terms_accepted && (
          <p className="text-sm text-red-600">{translateOrRaw(t, errors.terms_accepted.message)}</p>
        )}

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#0E6B58] text-white font-bold rounded-xl shadow-lg transition hover:bg-[#0a4e40] disabled:opacity-50"
        >
          {isLoading ? (isAr ? 'جاري إرسال الرمز...' : 'Sending code...') : (isAr ? 'إرسال رمز التحقق' : 'Send verification code')}
        </button>
      </form>

      <OtpCode
        isOpen={otpOpen}
        onClose={() => setOtpOpen(false)}
        phone={otpPhone}
        countryCode={otpCountryCode}
        purpose="register"
        onResendCode={resendOtp}
      />
    </div>
  );
};

export default CompanyRegisterForm;