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
import { getCountries, getCities } from '@/lib/api/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import OtpCode from '../login/OtpCode';

// ------------------------- Schema Validation ---------------------------
const companyRegisterSchema = z.object({
  company_name: z.string().min(3, "company_name_required"),
  email: z.string().email("email_invalid"),
  phone: z.string().min(5, 'mobile_format'),
  country_id: z.string().min(1, "country_required"),
  city_id: z.string().min(1, "city_required"),
  commercial_register: z.string().min(3, "commercial_register_required"),
  company_bio: z.string().min(5, "company_bio_required"),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: "terms_accepted_required",
  }),
  profile_image: z.any().optional(),
});

type CompanyRegisterFormData = z.infer<typeof companyRegisterSchema>;

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

const CompanyRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const t = useTranslations("RegisterPage");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [otpOpen, setOtpOpen] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpCountryCode, setOtpCountryCode] = useState('+971');

  // Helper for localized error message fallback
  const renderErrorMessage = (errKey?: string) => {
    if (!errKey) return "";
    const translationsMap: Record<string, { ar: string; en: string }> = {
      company_name_required: {
        ar: "اسم الشركة مطلوب (3 أحرف على الأقل)",
        en: "Company name is required (min 3 chars)",
      },
      email_invalid: {
        ar: "البريد الإلكتروني غير صالح",
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
      commercial_register_required: {
        ar: "رقم السجل التجاري مطلوب",
        en: "Commercial register number is required",
      },
      company_bio_required: {
        ar: "نبذة الشركة مطلوبة (5 أحرف على الأقل)",
        en: "Company bio is required (min 5 chars)",
      },
      terms_accepted_required: {
        ar: "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية",
        en: "You must accept the Terms and Privacy Policy",
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

  const defaultCountries = [
    { id: '1', code: 'uae', label: isAr ? 'الإمارات 🇦🇪' : 'UAE 🇦🇪', prefix: '+971', flag: '🇦🇪' },
    { id: '2', code: 'syria', label: isAr ? 'سوريا 🇸🇾' : 'Syria 🇸🇾', prefix: '+963', flag: '🇸🇾' },
    { id: '3', code: 'iraq', label: isAr ? 'العراق 🇮🇶' : 'Iraq 🇮🇶', prefix: '+964', flag: '🇮🇶' }
  ];

  const [countriesList, setCountriesList] = useState<any[]>(defaultCountries);
  const [citiesList, setCitiesList] = useState<{ value: string; label: string }[]>([]);
  const [selectedCountryObj, setSelectedCountryObj] = useState(defaultCountries[0]);

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
      country_id: "1",
      city_id: "",
      commercial_register: "",
      company_bio: "",
      terms_accepted: false,
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
    const localPhone = data.phone.trim().replace(/\D/g, '');

    try {
      const formData = new FormData();
      formData.append('client_type', 'company');
      formData.append('company_name', data.company_name);
      formData.append('email', data.email);
      formData.append('country_code', selectedCountryObj.prefix);
      formData.append('phone', localPhone);
      formData.append('country_id', String(data.country_id));
      formData.append('city_id', String(data.city_id));
      formData.append('commercial_register', data.commercial_register);
      formData.append('company_bio', data.company_bio);
      formData.append('terms_accepted', '1');

      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }

      const res = await apiServiceCall({
        url: 'client/auth/register',
        method: 'POST',
        body: formData,
        headers: {
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });

      setOtpPhone(localPhone);
      setOtpCountryCode(selectedCountryObj.prefix);
      setOtpOpen(true);
      toast.success(res?.message || (isAr ? 'تم إرسال رمز التحقق بنجاح' : 'Verification code sent successfully'));
    } catch (error: any) {
      Object.entries(apiFieldErrors(error)).forEach(([key, message]) => {
        setError(key as keyof CompanyRegisterFormData, { type: 'server', message });
      });
      toast.error(apiErrorMessage(error, t('register_error') || (isAr ? 'تعذر إنشاء الحساب' : 'Could not create account')));
    } finally {
      setIsLoading(false);
    }
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
    } catch (error: any) {
      toast.error(apiErrorMessage(error, isAr ? 'تعذر إعادة الإرسال' : 'Could not resend code'));
    }
  };

  return (
    <div className="relative">
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
              placeholder={isAr ? 'أدخل اسم الشركة' : 'Enter company name'}
              type="text"
              icon={<Image src={user} alt="" width={24} height={24} />}
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {renderErrorMessage(errors.company_name.message)}
              </p>
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
              placeholder={isAr ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
              type="email"
              icon={<Image src={email} alt="" width={24} height={24} />}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {renderErrorMessage(errors.email.message)}
              </p>
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
              countries={countriesList}
              selectedCountry={selectedCountryObj}
              onCountryChange={(country) => {
                setSelectedCountryObj(country);
                setValue('country_id', String(country.id));
              }}
              locale={locale}
            />
            
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {renderErrorMessage(errors.phone.message)}
              </p>
            )}
          </div>

          {/* اختيار البلد */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'البلد' : 'Country'}
            </label>
            <CustomSelect
              name="country_id"
              control={control}
              options={countriesList.map((c) => ({ value: String(c.id), label: c.label }))}
              placeholder={isAr ? 'اختر البلد' : 'Select Country'}
              icon={<Image src={location} alt="" width={24} height={24} />}
            />
            {errors.country_id && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {renderErrorMessage(errors.country_id.message)}
              </p>
            )}
          </div>

          {/* اختيار المدينة */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'المدينة' : 'City'}
            </label>
            <CustomSelect
              name="city_id"
              control={control}
              options={citiesList}
              placeholder={isAr ? 'اختر المدينة التابعة لك' : 'Select your city'}
              icon={<Image src={location} alt="" width={24} height={24} />}
            />
            {errors.city_id && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {renderErrorMessage(errors.city_id.message)}
              </p>
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
              placeholder={isAr ? 'أدخل رقم السجل التجاري' : 'Enter commercial register number'}
              type="text"
              icon={<Image src={check} alt="" width={24} height={24} />}
            />
            {errors.commercial_register && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {renderErrorMessage(errors.commercial_register.message)}
              </p>
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
              placeholder={isAr ? 'أدخل نبذة مختصرة عن الشركة' : 'Enter a brief company bio'}
              type="text"
              icon={<Image src={check} alt="" width={24} height={24} />}
            />
            {errors.company_bio && (
              <p className="mt-1 text-sm text-red-600 font-medium">
                {renderErrorMessage(errors.company_bio.message)}
              </p>
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
                  <p className="text-sm text-gray-500 font-bold">{isAr ? 'اضغط هنا للرفع أو اسحب الصورة' : 'Click to upload or drag image'}</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG ({isAr ? 'بحد أقصى 2MB' : 'Max 2MB'})</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
          {errors.profile_image && (
            <p className="mt-1 text-sm text-red-600 font-medium">
              {renderErrorMessage(errors.profile_image.message)}
            </p>
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
                className="h-5 w-5 rounded border-[#DCE6E2] text-[#0E6B58] focus:ring-[#0E6B58] mt-0.5 cursor-pointer"
              />
            )}
          />
          <label htmlFor="terms_accepted" className="text-sm text-gray-700 font-medium cursor-pointer">
            {isAr
              ? 'أوافق على الشروط والأحكام وسياسة الخصوصية الخاصة بالمنصة'
              : 'I agree to the Terms and Privacy Policy'}
          </label>
        </div>
        {errors.terms_accepted && (
          <p className="text-sm text-red-600 font-medium">
            {renderErrorMessage(errors.terms_accepted.message)}
          </p>
        )}

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#0E6B58] text-white font-bold rounded-xl shadow-lg transition hover:bg-[#0a4e40] disabled:opacity-50"
        >
          {isLoading
            ? (isAr ? 'جاري إرسال الرمز...' : 'Sending code...')
            : (isAr ? 'إرسال رمز التحقق' : 'Send verification code')}
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