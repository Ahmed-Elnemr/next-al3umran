'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Container from '@/components/shared/container';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import FieldError from '@/components/shared/reusableComponents/FieldError';
import { toast } from 'react-toastify';
import { FiUploadCloud, FiHome, FiImage, FiPlus, FiTrash2, FiMapPin, FiMail } from 'react-icons/fi';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import apiServiceCall from '@/lib/apiServiceCall';
import { getCategories } from '@/lib/api/client';
import {
  LuMapPin,
  LuBed,
  LuBath,
  LuMaximize,
  LuBuilding2,
  LuDollarSign,
  LuPhone,
  LuSmartphone,
  LuGlobe,
  LuMap,
  LuCheck
} from 'react-icons/lu';

type FormValues = {
  category_id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  listing_type: string;
  price: string;
  currency: string;
  rent_period: string;
  country_id: string;
  city_id: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  location_ar: string;
  location_en: string;
  phone: string;
  whatsapp: string;
  email: string;
  features: { ar: string; en: string }[];
  cover: File | string | null;
  images: (File | string)[];
};

type Category = {
  id: number;
  name: string;
};

type Country = {
  id: number;
  name: string;
  phone_prefix: string;
};

type City = {
  id: number;
  name: string;
};

export default function AddPropertyForm({ token }: { token: string }) {
  const t = useTranslations('sellService');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const searchParams = useSearchParams();
  const editId = searchParams.get('editId');
  const isEditing = !!editId;
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingEditData, setFetchingEditData] = useState(isEditing);
  
  const { 
    register, 
    control, 
    handleSubmit, 
    setValue, 
    getValues,
    reset,
    watch,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      category_id: '',
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      listing_type: 'sale',
      price: '',
      currency: 'AED',
      rent_period: '',
      country_id: '',
      city_id: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      location_ar: '',
      location_en: '',
      phone: '',
      whatsapp: '',
      email: '',
      features: [{ ar: '', en: '' }],
      cover: null,
      images: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const watchListingType = watch('listing_type');
  const watchCountryId = watch('country_id');

  const selectedCountry = countries.find(c => c.id.toString() === watchCountryId);
  const phonePlaceholder = selectedCountry?.phone_prefix ? `${selectedCountry.phone_prefix} ...` : '...';

  /* ================= Fetch Categories and Countries ================= */
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch Categories
        const catRes: any = await getCategories(locale);
        const catData = Array.isArray(catRes?.data) ? catRes.data : Array.isArray(catRes?.data?.data) ? catRes.data.data : [];
        if (catData.length > 0) setCategories(catData);

        // Fetch Countries
        const countriesRes: any = await apiServiceCall({
          url: 'client/countries',
          method: 'GET',
          headers: { 'Accept-Language': locale }
        });
        const countryData = Array.isArray(countriesRes?.data) ? countriesRes.data : Array.isArray(countriesRes?.data?.data) ? countriesRes.data.data : [];
        if (countryData.length > 0) setCountries(countryData);
      } catch (error) {
        console.warn('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [locale]);

  /* ================= Fetch Cities based on Country ================= */
  useEffect(() => {
    const fetchCitiesList = async () => {
      if (!watchCountryId) {
        setCities([]);
        return;
      }
      try {
        setLoadingCities(true);
        const res: any = await apiServiceCall({
          url: `client/cities?country_id=${watchCountryId}`,
          method: 'GET',
          headers: { 'Accept-Language': locale }
        });
        const cityData = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : [];
        setCities(cityData);
      } catch (error) {
        console.warn('Error fetching cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCitiesList();
  }, [watchCountryId, locale]);

  /* ================= Fetch Edit Property Data ================= */
  useEffect(() => {
    if (!editId) return;
    const fetchEditData = async () => {
      try {
        setFetchingEditData(true);
        const res: any = await apiServiceCall({
          url: `client/my/properties/${editId}`,
          method: 'GET',
          headers: {
            'Accept-Language': locale,
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = res?.data;
        if (data) {
          reset({
            category_id: data.category?.id?.toString() || '',
            title_ar: data.title || '',
            title_en: data.title || '',
            description_ar: data.description || '',
            description_en: data.description || '',
            listing_type: data.listing_type || 'sale',
            price: data.price?.toString() || '',
            currency: data.currency || 'AED',
            rent_period: data.rent_period || '',
            country_id: data.country?.id?.toString() || '',
            city_id: data.city?.id?.toString() || '',
            bedrooms: data.bedrooms?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
            area: data.area?.toString() || '',
            location_ar: data.location || '',
            location_en: data.location || '',
            phone: data.phone || '',
            whatsapp: data.whatsapp || '',
            email: data.email || '',
            features: (data.features && data.features.length > 0) 
              ? data.features.map((f: any) => ({ ar: f.value || '', en: f.value || '' }))
              : [{ ar: '', en: '' }],
            cover: data.image || null,
            images: data.images || [],
          });
          
          if (data.image) setCoverPreview(data.image);
          if (data.images && data.images.length > 0) setGalleryPreviews(data.images);
        }
      } catch (error) {
        console.warn('Error fetching property for edit:', error);
        toast.error(isAr ? 'فشل تحميل بيانات العقار' : 'Failed to load property data');
      } finally {
        setFetchingEditData(false);
      }
    };
    
    fetchEditData();
  }, [editId, locale, token, reset]);

  /* ================= Media Upload ================= */
  const coverRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);
  
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('cover', file);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(file));
    }
    if (coverRef.current) coverRef.current.value = '';
  };

  const removeCover = () => {
    setValue('cover', null);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const fileArray = Array.from(files);
    const currentImages = getValues('images') || [];
    const remainingSlots = 10 - currentImages.length;
    const filesToAdd = fileArray.slice(0, remainingSlots);
    
    if (filesToAdd.length === 0) {
      toast.warning(isAr ? 'يمكنك رفع حتى 10 صور كحد أقصى' : 'Max 10 images allowed');
      return;
    }
    
    const updatedImages = [...currentImages, ...filesToAdd];
    setValue('images', updatedImages);
    
    const newPreviews = filesToAdd.map(f => URL.createObjectURL(f));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
    
    if (galleryRef.current) galleryRef.current.value = '';
  };

  const removeGalleryImage = (index: number) => {
    const newPreviews = [...galleryPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);
    
    const currentImages = getValues('images') || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setValue('images', updatedImages);
  };

  /* ================= Form Submission ================= */
  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      
      const formData = new FormData();
      
      formData.append('category_id', data.category_id);
      formData.append('title[ar]', data.title_ar);
      formData.append('title[en]', data.title_en);
      formData.append('description[ar]', data.description_ar);
      formData.append('description[en]', data.description_en);
      formData.append('location[ar]', data.location_ar);
      formData.append('location[en]', data.location_en);
      formData.append('listing_type', data.listing_type);
      formData.append('price', data.price);
      formData.append('currency', data.currency);
      
      if (data.listing_type === 'rent' && data.rent_period) {
        formData.append('rent_period', data.rent_period);
      }
      
      formData.append('country_id', data.country_id);
      formData.append('city_id', data.city_id);
      formData.append('bedrooms', data.bedrooms);
      formData.append('bathrooms', data.bathrooms);
      formData.append('area', data.area);
      formData.append('phone', data.phone);
      formData.append('whatsapp', data.whatsapp);
      formData.append('email', data.email);
      
      data.features.forEach((feature, index) => {
        if (feature.ar.trim()) formData.append(`features[${index}][ar]`, feature.ar);
        if (feature.en.trim()) formData.append(`features[${index}][en]`, feature.en);
      });
      
      if (data.cover) {
        formData.append('cover', data.cover);
      }
      
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else if (isEditing) {
        formData.append('images', '');
      }
      
      if (isEditing) {
        formData.append('_method', 'PUT');
      }
      
      const response = await apiServiceCall({
        url: isEditing ? `client/my/properties/${editId}` : 'client/my/properties',
        method: 'POST', // Always POST for FormData in Laravel, using _method for PUT
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      
      if (response.status_code === 200 || response.status_code === 201 || response.status_code === "1000" || response.status_code === 1000) {
        toast.success(isAr 
          ? (isEditing ? 'تم تعديل العقار بنجاح' : 'تم إضافة العقار بنجاح')
          : (isEditing ? 'Property updated successfully' : 'Property added successfully'));
        
        if (!isEditing) {
          reset();
          removeCover();
          galleryPreviews.forEach(url => URL.revokeObjectURL(url));
          setGalleryPreviews([]);
          setValue('features', [{ ar: '', en: '' }]);
        }
      } else {
        toast.error(response.message || (isAr ? 'فشل الإرسال' : 'Submission failed'));
      }
      
    } catch (error: any) {
      console.error('Submission Error:', error);
      if (error?.data?.message) toast.error(error.data.message);
      else if (error?.data?.errors) {
        Object.values(error.data.errors).forEach((err: any) => {
          if (Array.isArray(err)) err.forEach(msg => toast.error(msg));
          else toast.error(err);
        });
      } else {
        toast.error(isAr ? 'حدث خطأ أثناء الإرسال' : 'Error during submission');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  const listingTypeOptions = [
    { value: 'sale', label: isAr ? 'للبيع' : 'For Sale' },
    { value: 'rent', label: isAr ? 'للإيجار' : 'For Rent' },
  ];

  const currencyOptions = [
    { value: 'AED', label: 'AED' },
    { value: 'SAR', label: 'SAR' },
    { value: 'USD', label: 'USD' },
  ];

  const rentPeriodOptions = [
    { value: 'day', label: isAr ? 'يومي' : 'Daily' },
    { value: 'month', label: isAr ? 'شهري' : 'Monthly' },
    { value: 'year', label: isAr ? 'سنوي' : 'Yearly' },
  ];

  if (fetchingEditData) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-[#0E6B58] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-bold text-[#101820]">
            {isAr ? 'جاري جلب بيانات العقار...' : 'Fetching property data...'}
          </p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="max-w-5xl mx-auto py-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#0E6B58] to-[#101820] flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FiHome size={40} className="text-[#C89B3C]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#101820] mb-4">
            {isEditing 
              ? (isAr ? 'تعديل بيانات العقار' : 'Edit Property Details') 
              : (t('title') || 'أضف عقارك')}
          </h1>
          <p className="text-lg text-[#5E6D68] max-w-xl mx-auto font-medium">
            {t('subtitle') || 'أضف تفاصيل عقارك بشكل احترافي للوصول إلى آلاف العملاء'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* ================= 1. Basic Information ================= */}
          <SectionCard title={isAr ? 'المعلومات الأساسية' : 'Basic Information'} icon={<LuBuilding2 />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomSelect
                name="category_id"
                control={control}
                rules={{ required: isAr ? 'القسم مطلوب' : 'Category is required' }}
                options={categoryOptions}
                placeholder={loading ? (isAr ? 'جاري التحميل...' : 'Loading...') : (isAr ? 'اختر القسم' : 'Select Category')}
                label={isAr ? 'قسم العقار' : 'Property Category'}
                error={errors.category_id?.message}
              />

              <CustomSelect
                name="listing_type"
                control={control}
                rules={{ required: isAr ? 'النوع مطلوب' : 'Type is required' }}
                options={listingTypeOptions}
                placeholder={isAr ? 'للبيع / للإيجار' : 'Sale / Rent'}
                label={isAr ? 'نوع العرض' : 'Listing Type'}
                error={errors.listing_type?.message}
              />

              <InputComponent
                register={register}
                name="title_ar"
                type="text"
                label={isAr ? 'العنوان بالعربية' : 'Title (Arabic)'}
                placeholder={isAr ? 'مثال: فيلا فاخرة للإيجار' : 'e.g. Luxury Villa'}
                error={errors.title_ar?.message}
                rules={{ required: isAr ? 'العنوان مطلوب' : 'Title is required' }}
              />

              <InputComponent
                register={register}
                name="title_en"
                type="text"
                label={isAr ? 'العنوان بالإنجليزية' : 'Title (English)'}
                placeholder="e.g. Luxury Villa for Rent"
                error={errors.title_en?.message}
                rules={{ required: isAr ? 'العنوان مطلوب' : 'Title is required' }}
              />

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#101820] mb-2">{isAr ? 'الوصف بالعربية' : 'Description (Arabic)'}</label>
                  <textarea
                    {...register('description_ar', { required: isAr ? 'الوصف مطلوب' : 'Description required' })}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl bg-[#F8F6F1] border border-[#E4DED1] focus:ring-2 focus:ring-[#C89B3C] focus:bg-white transition-all text-sm font-medium outline-none"
                    placeholder={isAr ? 'اكتب وصفاً مفصلاً لعقارك...' : 'Detailed description...'}
                  />
                  {errors.description_ar && <FieldError message={errors.description_ar.message} />}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#101820] mb-2">{isAr ? 'الوصف بالإنجليزية' : 'Description (English)'}</label>
                  <textarea
                    {...register('description_en', { required: isAr ? 'الوصف مطلوب' : 'Description required' })}
                    rows={4}
                    className="w-full px-5 py-4 rounded-2xl bg-[#F8F6F1] border border-[#E4DED1] focus:ring-2 focus:ring-[#C89B3C] focus:bg-white transition-all text-sm font-medium outline-none"
                    placeholder="Write a detailed description..."
                  />
                  {errors.description_en && <FieldError message={errors.description_en.message} />}
                </div>
              </div>

              <InputComponent
                register={register}
                name="price"
                type="number"
                label={isAr ? 'السعر' : 'Price'}
                placeholder="0.00"
                icon={<LuDollarSign />}
                error={errors.price?.message}
                rules={{ required: isAr ? 'السعر مطلوب' : 'Price is required' }}
              />

              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  name="currency"
                  control={control}
                  rules={{ required: true }}
                  options={currencyOptions}
                  placeholder={isAr ? 'العملة' : 'Currency'}
                  label={isAr ? 'العملة' : 'Currency'}
                />
                
                {watchListingType === 'rent' && (
                  <CustomSelect
                    name="rent_period"
                    control={control}
                    rules={{ required: watchListingType === 'rent' ? (isAr ? 'مطلوب' : 'Required') : false }}
                    options={rentPeriodOptions}
                    placeholder={isAr ? 'فترة الإيجار' : 'Rent Period'}
                    label={isAr ? 'الفترة' : 'Period'}
                    error={errors.rent_period?.message}
                  />
                )}
              </div>
            </div>
          </SectionCard>

          {/* ================= 2. Property Details ================= */}
          <SectionCard title={isAr ? 'تفاصيل العقار' : 'Property Details'} icon={<LuMaximize />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <InputComponent
                register={register}
                name="bedrooms"
                type="number"
                label={isAr ? 'عدد الغرف' : 'Bedrooms'}
                placeholder="0"
                icon={<LuBed />}
                error={errors.bedrooms?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
              <InputComponent
                register={register}
                name="bathrooms"
                type="number"
                label={isAr ? 'عدد الحمامات' : 'Bathrooms'}
                placeholder="0"
                icon={<LuBath />}
                error={errors.bathrooms?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
              <InputComponent
                register={register}
                name="area"
                type="number"
                label={isAr ? 'المساحة (م²)' : 'Area (m²)'}
                placeholder="0"
                icon={<LuMaximize />}
                error={errors.area?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-bold text-[#101820]">
                  {isAr ? 'مميزات العقار' : 'Property Features'}
                </label>
                <button
                  type="button"
                  onClick={() => append({ ar: '', en: '' })}
                  className="flex items-center gap-2 text-[#0E6B58] font-bold text-sm hover:text-[#C89B3C] transition-colors"
                >
                  <FiPlus /> {isAr ? 'إضافة ميزة' : 'Add Feature'}
                </button>
              </div>
              
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-2xl border border-gray-100 relative group">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                      <InputComponent
                        register={register}
                        name={`features.${index}.ar` as const}
                        type="text"
                        placeholder={isAr ? 'الميزة بالعربية (مثال: مسبح)' : 'Feature AR'}
                        rules={{ required: isAr ? 'مطلوب' : 'Required' }}
                        error={errors.features?.[index]?.ar?.message}
                      />
                      <InputComponent
                        register={register}
                        name={`features.${index}.en` as const}
                        type="text"
                        placeholder={isAr ? 'الميزة بالإنجليزية (مثال: Pool)' : 'Feature EN'}
                        rules={{ required: isAr ? 'مطلوب' : 'Required' }}
                        error={errors.features?.[index]?.en?.message}
                      />
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="mt-3 w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* ================= 3. Location ================= */}
          <SectionCard title={isAr ? 'الموقع' : 'Location'} icon={<LuMapPin />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomSelect
                name="country_id"
                control={control}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
                options={countries.map(c => ({ value: c.id.toString(), label: c.name }))}
                placeholder={loading ? (isAr ? 'جاري التحميل...' : 'Loading...') : (isAr ? 'اختر الدولة' : 'Select Country')}
                label={isAr ? 'الدولة' : 'Country'}
                error={errors.country_id?.message}
              />
              <CustomSelect
                name="city_id"
                control={control}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
                options={cities.map(c => ({ value: c.id.toString(), label: c.name }))}
                placeholder={
                  !watchCountryId
                    ? (isAr ? 'يرجى اختيار الدولة أولاً' : 'Select Country First')
                    : loadingCities
                      ? (isAr ? 'جاري التحميل...' : 'Loading...')
                      : (isAr ? 'اختر المدينة' : 'Select City')
                }
                label={isAr ? 'المدينة' : 'City'}
                error={errors.city_id?.message}
                disabled={!watchCountryId}
              />
              <InputComponent
                register={register}
                name="location_ar"
                type="text"
                label={isAr ? 'الموقع بالعربية' : 'Location (Arabic)'}
                placeholder={isAr ? 'دبي، وسط المدينة' : 'Dubai, Downtown'}
                icon={<FiMapPin />}
                error={errors.location_ar?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
              <InputComponent
                register={register}
                name="location_en"
                type="text"
                label={isAr ? 'الموقع بالإنجليزية' : 'Location (English)'}
                placeholder="Dubai, Downtown"
                icon={<FiMapPin />}
                error={errors.location_en?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
            </div>
          </SectionCard>

          {/* ================= 4. Media ================= */}
          <SectionCard title={isAr ? 'الصور والوسائط' : 'Media & Images'} icon={<FiImage />}>
            <div className="space-y-8">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-bold text-[#101820] mb-3">
                  {isAr ? 'الصورة الرئيسية (الغلاف)' : 'Cover Image'}
                </label>
                {!coverPreview ? (
                  <div
                    onClick={() => coverRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-[#C89B3C] bg-[#F8F6F1] rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-white transition-colors group"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#0E6B58]/10 text-[#0E6B58] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FiUploadCloud size={30} />
                    </div>
                    <p className="font-bold text-[#101820]">{isAr ? 'اضغط لرفع صورة الغلاف' : 'Click to upload cover'}</p>
                    <p className="text-sm text-[#7A8782] mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                ) : (
                  <div className="relative w-full h-64 rounded-3xl overflow-hidden group shadow-lg border border-gray-200">
                    <Image src={coverPreview} alt="Cover Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={removeCover}
                        className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                      >
                        <FiTrash2 size={24} />
                      </button>
                    </div>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" ref={coverRef} onChange={handleCoverChange} />
              </div>

              {/* Gallery Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-bold text-[#101820]">
                    {isAr ? 'معرض الصور (بحد أقصى 10 صور)' : 'Gallery Images (Max 10)'}
                  </label>
                  <span className="text-sm font-bold text-[#0E6B58] bg-[#0E6B58]/10 px-3 py-1 rounded-full">
                    {galleryPreviews.length} / 10
                  </span>
                </div>
                
                {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative h-28 rounded-2xl overflow-hidden group shadow-sm border border-gray-200">
                        <Image src={preview} alt={`Gallery ${index}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-2 end-2 w-8 h-8 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {galleryPreviews.length < 10 && (
                  <div
                    onClick={() => galleryRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-[#E4DED1] bg-[#F8F6F1] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#C89B3C] hover:bg-white transition-colors"
                  >
                    <FiPlus size={24} className="text-[#C89B3C] mb-2" />
                    <p className="font-bold text-sm text-[#5E6D68]">{isAr ? 'إضافة صور للمعرض' : 'Add Gallery Images'}</p>
                  </div>
                )}
                <input type="file" accept="image/*" multiple className="hidden" ref={galleryRef} onChange={handleGalleryChange} />
              </div>
            </div>
          </SectionCard>

          {/* ================= 5. Contact Info ================= */}
          <SectionCard title={isAr ? 'معلومات التواصل' : 'Contact Information'} icon={<LuPhone />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputComponent
                register={register}
                name="phone"
                type="text"
                label={isAr ? 'رقم الهاتف' : 'Phone'}
                placeholder={phonePlaceholder}
                icon={<LuPhone />}
                error={errors.phone?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
              <InputComponent
                register={register}
                name="whatsapp"
                type="text"
                label={isAr ? 'رقم الواتساب' : 'WhatsApp'}
                placeholder={phonePlaceholder}
                icon={<LuSmartphone />}
                error={errors.whatsapp?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
              <InputComponent
                register={register}
                name="email"
                type="email"
                label={isAr ? 'البريد الإلكتروني' : 'Email'}
                placeholder="example@mail.com"
                icon={<FiMail />}
                error={errors.email?.message}
                rules={{ required: isAr ? 'مطلوب' : 'Required' }}
              />
            </div>
          </SectionCard>

          {/* ================= Submit Button ================= */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full h-16 bg-gradient-to-r from-[#0E6B58] to-[#101820] text-white rounded-2xl font-black text-xl shadow-[0_20px_50px_rgba(14,107,88,0.3)] hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(14,107,88,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <span>{isAr ? 'نشر العقار' : 'Publish Property'}</span>
                <LuCheck size={24} className="text-[#C89B3C]" />
              </>
            )}
          </button>
        </form>
      </div>
    </Container>
  );
}

const SectionCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-[0_20px_70px_rgba(16,24,32,0.06)] border border-[#E7E1D6]/50">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#E7E1D6]/60">
        <div className="w-12 h-12 rounded-xl bg-[#F8F6F1] text-[#0E6B58] flex items-center justify-center text-xl">
          {icon}
        </div>
        <h2 className="text-2xl font-black text-[#101820]">{title}</h2>
      </div>
      {children}
    </div>
  );
};
