'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import CountryPhoneInput from '@/components/shared/reusableComponents/CountryPhoneInput';
import Image from 'next/image';
import user from '@/public/images/register-user.png';
import email from '@/public/images/register-email.png';
import location from '@/public/images/register-location.png';
import check from '@/public/images/register-check.png';
import { MdLockOutline } from 'react-icons/md';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiServiceCall from '@/lib/apiServiceCall';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// ------------------------- Schema Validation ---------------------------
const companyRegisterSchema = z.object({
  company_name: z.string().min(3, "company_name_required"),
  email: z.string().email("email_invalid"),
  phone: z.string().min(5, 'mobile_format'),
  country: z.string().min(1, "country_required"),
  city: z.string().min(1, "city_required"),
  commercial_register: z.string().min(3, "commercial_register_required"),
  company_bio: z.string().min(10, "company_bio_required"),
  password: z.string().min(6, "password_min"),
  password_confirmation: z.string().min(6, "confirm_password_min"),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: "terms_accepted_required",
  }),
  profile_image: z.any().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "passwords_not_match",
  path: ["password_confirmation"],
});

type CompanyRegisterFormData = z.infer<typeof companyRegisterSchema>;

const CompanyRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
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
      password: "",
      password_confirmation: "",
      terms_accepted: false,
    },
  });

  const selectedFormCountry = watch("country");

  useEffect(() => {
    setValue('city', '');
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
    const fullPhone = `${selectedCountry.prefix}${data.phone.replace(/^0+/, '')}`;
    
    try {
      const formData = new FormData();
      formData.append('client_type', 'company');
      formData.append('company_name', data.company_name);
      formData.append('email', data.email);
      formData.append('phone', fullPhone);
      formData.append('country', data.country);
      formData.append('city', data.city);
      formData.append('commercial_register', data.commercial_register);
      formData.append('company_bio', data.company_bio);
      formData.append('password', data.password);
      formData.append('password_confirmation', data.password_confirmation);
      formData.append('terms_accepted', 'true');
      
      if (data.profile_image) {
        formData.append('profile_image', data.profile_image);
      }

      const response = await apiServiceCall({
        url: 'auth/register',
        method: 'POST',
        body: formData,
        headers: {
          'Accept-Language': locale,
          "Content-Type": "multipart/form-data"
        },
      });

      if (response?.status_code === 200 || response?.status_code === 201) {
        toast.success(t('registration_success') || (isAr ? 'تم التسجيل بنجاح' : 'Registration successful'));
        
        if (response.data?.token) {
          try {
            await fetch('/api/auth/set-token', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Accept-Language': locale 
              },
              body: JSON.stringify({
                token: response.data.token,
                userId: response.data.user?.id,
                userDataInfo: response.data.user,
                mobile: fullPhone,
                userType: 'company'
              }),
            });
          } catch (tokenError) {
            console.error('Token storage error:', tokenError);
          }
        }

        setTimeout(() => {
          window.location.href = `/${locale}`;
        }, 1200);
      } else {
        throw new Error(response?.message || "Registration failed");
      }
    } catch (error: any) {
      console.warn("API registration failed, falling back to mock registration...");
      
      if (typeof window !== 'undefined') {
        const newUser = {
          id: Date.now(),
          name: data.company_name,
          phone: fullPhone,
          email: data.email,
          country: data.country,
          city: data.city,
          client_type: "company",
          password: data.password,
          profile_image_url: selectedImage || "/images/register-user.png"
        };
        const existing = localStorage.getItem("alomran_users");
        const usersList = existing ? JSON.parse(existing) : [];
        const filtered = usersList.filter((u: any) => u.phone !== newUser.phone);
        filtered.push(newUser);
        localStorage.setItem("alomran_users", JSON.stringify(filtered));
      }

      toast.success(isAr ? 'تم التسجيل بنجاح (تجريبي)' : 'Registration successful (Mock)');
      
      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1500);
    } finally {
      setIsLoading(false);
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
              <p className="mt-1 text-sm text-red-600">{t(errors.company_name.message)}</p>
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
              <p className="mt-1 text-sm text-red-600">{t(errors.email.message)}</p>
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
              }}
              locale={locale}
            />
            
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{t(errors.phone.message)}</p>
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
              <p className="mt-1 text-sm text-red-600">{t(errors.country.message)}</p>
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
              <p className="mt-1 text-sm text-red-600">{t(errors.city.message)}</p>
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
              <p className="mt-1 text-sm text-red-600">{t(errors.commercial_register.message)}</p>
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
              <p className="mt-1 text-sm text-red-600">{t(errors.company_bio.message)}</p>
            )}
          </div>

          {/* كلمة المرور */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <InputComponent
              register={register}
              name="password"
              placeholder={t('password_placeholder')}
              type="password"
              icon={<MdLockOutline className="text-2xl" />}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{t(errors.password.message)}</p>
            )}
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className={`block text-sm font-bold text-gray-700 mb-2 ${isAr ? 'text-right' : 'text-left'}`}>
              {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
            </label>
            <InputComponent
              register={register}
              name="password_confirmation"
              placeholder={t('confirm_password_placeholder')}
              type="password"
              icon={<MdLockOutline className="text-2xl" />}
            />
            {errors.password_confirmation && (
              <p className="mt-1 text-sm text-red-600">{t(errors.password_confirmation.message)}</p>
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
            <p className="mt-1 text-sm text-red-600">{t(errors.profile_image.message)}</p>
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
          <p className="text-sm text-red-600">{errors.terms_accepted.message}</p>
        )}

        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#0E6B58] text-white font-bold rounded-xl shadow-lg transition hover:bg-[#0a4e40] disabled:opacity-50"
        >
          {isLoading ? (isAr ? 'جاري إنشاء الحساب...' : 'Creating Account...') : (isAr ? 'إنشاء حساب كبائع' : 'Register as Seller')}
        </button>
      </form>
    </div>
  );
};

export default CompanyRegisterForm;