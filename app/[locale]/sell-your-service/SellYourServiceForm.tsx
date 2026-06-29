'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Container from '@/components/shared/container';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import { toast } from 'react-toastify';
import { FiUploadCloud, FiHome } from 'react-icons/fi';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import apiServiceCall from '@/lib/apiServiceCall';
import {
  LuMapPin,
  LuBed,
  LuBath,
  LuMaximize,
  LuBuilding2,
  LuDollarSign,
  LuPhone,
  LuSmartphone,
  LuSend,
  LuCheck,
} from 'react-icons/lu';

type FormValues = {
  // القسم
  catalog_category_id: string;
  
  // بيانات العقار الأساسية
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  
  // الميزات
  features: { value: string }[];
  
  // بيانات العقار
  price: string;
  phone: string;
  mobile: string;
  
  // بيانات العقار الإضافية (جديدة)
  property_type: string; // sale | rent
  bedrooms: string;
  bathrooms: string;
  area: string;
  location_ar: string;
  location_en: string;
  company_name_ar: string;
  company_name_en: string;
  
  // الصور
  images: File[];
};

type Category = {
  id: number;
  name: string;
  description: string;
  image: string;
};

export default function SellYourService({ token }: { token: string }) {
  const t = useTranslations('sellService');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { 
    register, 
    control, 
    handleSubmit, 
    setValue, 
    reset,
    watch,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      features: [{ value: '' }],
      images: [],
      catalog_category_id: '',
      title_ar: '',
      title_en: '',
      content_ar: '',
      content_en: '',
      price: '',
      phone: '',
      mobile: '',
      property_type: 'sale',
      bedrooms: '',
      bathrooms: '',
      area: '',
      location_ar: '',
      location_en: '',
      company_name_ar: '',
      company_name_en: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  const propertyType = watch('property_type');

  /* ================= جلب الأقسام ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiServiceCall({
          url: 'categories',
          method: 'GET',
        });
        
        if (response.status_code === 200) {
          setCategories(response.data);
        } else {
          toast.error(t('categoriesLoadError') || 'Failed to load categories');
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        toast.error(error?.data?.message || t('categoriesLoadError') || 'Error loading categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= رفع الصور ================= */
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (files: FileList) => {
    const fileArray = Array.from(files);
    const currentImages = control._formValues.images || [];
    const remainingSlots = 5 - currentImages.length;
    const filesToAdd = fileArray.slice(0, remainingSlots);
    
    if (filesToAdd.length === 0) {
      toast.warning(t('maxImagesWarning') || 'يمكنك رفع حتى 5 صور فقط');
      return;
    }
    
    const updatedImages = [...currentImages, ...filesToAdd];
    setValue('images', updatedImages);
    
    previews.forEach(url => URL.revokeObjectURL(url));
    
    const previewUrls = filesToAdd.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...previewUrls]);
    
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...previews];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    setPreviews(newImages);
    
    const currentImages = control._formValues.images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setValue('images', updatedImages);
  };

  /* ================= إرسال البيانات ================= */
  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      
      const formData = new FormData();
      
      // البيانات الأساسية
      formData.append('catalog_category_id', data.catalog_category_id);
      formData.append('title[ar]', data.title_ar);
      formData.append('title[en]', data.title_en);
      formData.append('content[ar]', data.content_ar);
      formData.append('content[en]', data.content_en);
      
      // بيانات العقار
      formData.append('price', data.price);
      formData.append('phone', data.phone);
      formData.append('mobile', data.mobile);
      formData.append('property_type', data.property_type);
      formData.append('bedrooms', data.bedrooms);
      formData.append('bathrooms', data.bathrooms);
      formData.append('area', data.area);
      formData.append('location[ar]', data.location_ar);
      formData.append('location[en]', data.location_en);
      formData.append('company_name[ar]', data.company_name_ar);
      formData.append('company_name[en]', data.company_name_en);
      
      // الميزات
      data.features.forEach((feature, index) => {
        if (feature.value.trim()) {
          formData.append(`features[${index}]`, feature.value);
        }
      });
      
      // الصور
      if (data.images && data.images.length > 0) {
        data.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }
      
      const response = await apiServiceCall({
        url: 'user/create/services',
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      
      if (response.status_code === 200 || response.status_code === 201) {
        toast.success(t('success'));
        reset();
        setPreviews([]);
        previews.forEach(url => URL.revokeObjectURL(url));
        setValue('features', [{ value: '' }]);
        setValue('images', []);
      } else {
        toast.error(response.message || t('submitError') || 'Failed to submit');
      }
      
    } catch (error: any) {
      console.error('Error submitting form:', error);
      
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else if (error?.data?.errors) {
        Object.values(error.data.errors).forEach((err: any) => {
          if (Array.isArray(err)) {
            err.forEach(msg => toast.error(msg));
          } else {
            toast.error(err);
          }
        });
      } else {
        toast.error(t('submitError') || 'An error occurred while submitting');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = categories.map(category => ({
    value: category.id.toString(),
    label: category.name,
  }));

  const propertyTypeOptions = [
    { value: 'sale', label: 'للبيع - For Sale' },
    { value: 'rent', label: 'للإيجار - For Rent' },
  ];

  return (
    <Container>
      <div className="max-w-6xl mx-auto bg-white p-6 lg:p-10 rounded-[42px] shadow-[0_30px_80px_rgba(16,24,32,0.08)] mt-10 border border-[#E7E1D6]">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0E6B58] to-[#101820] flex items-center justify-center mx-auto mb-4">
            <FiHome size={32} className="text-[#C89B3C]" />
          </div>
          <h1 className="text-3xl font-black text-[#101820]">
            {t('title') || 'إضافة عقار جديد'}
          </h1>
          <p className="text-[#63756F] mt-2">
            {t('subtitle') || 'أضف عقارك الآن ووصل لعملاء جادين'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ========== القسم الأول: الصور والمعلومات الأساسية ========== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* رفع الصور */}
            <div>
              <label className="block text-sm font-bold text-[#101820] mb-3">
                {t('images') || 'صور العقار'}
              </label>
              <div 
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-[#E7E1D6] rounded-3xl flex flex-col items-center justify-center min-h-[300px] bg-[#F6F4EE] hover:border-[#0E6B58] transition relative"
              >
                {previews.length > 0 ? (
                  <div className="w-full p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group">
                          <Image 
                            src={preview} 
                            alt={`العقار ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    {previews.length < 5 && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-[#63756F]">
                          {t('addMoreImages') || 'اضغط لإضافة المزيد من الصور'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <FiUploadCloud size={48} className="text-[#0E6B58] mb-3" />
                    <p className="font-bold text-[#101820]">
                      {t('uploadImage') || 'اضغط لرفع الصور'}
                    </p>
                    <span className="text-sm text-[#63756F] mt-1">
                      {t('imageFormats') || 'JPG, PNG, WEBP - حتى 5 صور'}
                    </span>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => e.target.files && handleImageChange(e.target.files)}
                />
              </div>
              <p className="text-sm text-[#63756F] mt-2">
                {t('maxImagesNote') || 'يمكنك رفع حتى 5 صور'}
              </p>
            </div>

            {/* المعلومات الأساسية */}
            <div className="space-y-5">
              {/* القسم */}
              <div>
                <label className="block text-sm font-bold text-[#101820] mb-2">
                  {t('category') || 'القسم'}
                </label>
                {loading ? (
                  <div className="bg-[#F6F4EE] h-[54px] rounded-2xl flex items-center justify-center">
                    <span className="text-[#63756F]">جاري تحميل الأقسام...</span>
                  </div>
                ) : (
                  <CustomSelect
                    control={control}
                    name="catalog_category_id"
                    placeholder={t('selectCategory') || 'اختر القسم'}
                    options={categoryOptions}
                    rules={{ required: t('categoryRequired') || "القسم مطلوب" }}
                  />
                )}
                {errors.catalog_category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.catalog_category_id.message}
                  </p>
                )}
              </div>

              {/* العنوان عربي */}
              <InputComponent
                register={register}
                name="title_ar"
                placeholder={t('titleAr') || 'العنوان بالعربية'}
                error={errors.title_ar?.message}
                icon={<LuBuilding2 className="text-[#63756F]" />}
                rules={{ 
                  required: t('titleArRequired') || "العنوان بالعربية مطلوب",
                  minLength: {
                    value: 3,
                    message: t('titleShort') || "العنوان قصير جداً"
                  }
                }}
              />

              {/* العنوان إنجليزي */}
              <InputComponent
                register={register}
                name="title_en"
                placeholder={t('titleEn') || 'Title in English'}
                error={errors.title_en?.message}
                icon={<LuBuilding2 className="text-[#63756F]" />}
                rules={{ 
                  required: t('titleEnRequired') || "English title is required",
                  minLength: {
                    value: 3,
                    message: t('titleShort') || "Title is too short"
                  }
                }}
              />
            </div>
          </div>

          {/* ========== القسم الثاني: بيانات العقار ========== */}
          <div className="bg-[#F6F4EE] rounded-3xl p-6 lg:p-8 border border-[#E7E1D6]">
            <h2 className="text-xl font-black text-[#101820] mb-6 flex items-center gap-3">
              <FiHome size={24} className="text-[#0E6B58]" />
              {t('propertyDetails') || 'بيانات العقار'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* نوع العقار */}
              <div>
                <label className="block text-sm font-bold text-[#101820] mb-2">
                  {t('propertyType') || 'نوع العقار'}
                </label>
                <CustomSelect
                  control={control}
                  name="property_type"
                  placeholder={t('selectType') || 'اختر النوع'}
                  options={propertyTypeOptions}
                  rules={{ required: t('typeRequired') || "النوع مطلوب" }}
                />
                {errors.property_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.property_type.message}
                  </p>
                )}
              </div>

              {/* السعر */}
              <InputComponent
                register={register}
                name="price"
                type="number"
                placeholder={t('price') || 'السعر'}
                error={errors.price?.message}
                icon={<LuDollarSign className="text-[#63756F]" />}
                rules={{ 
                  required: t('priceRequired') || "السعر مطلوب",
                  min: { 
                    value: 0, 
                    message: t('priceInvalid') || "السعر يجب أن يكون موجباً" 
                  }
                }}
              />

              {/* عدد الغرف */}
              <InputComponent
                register={register}
                name="bedrooms"
                type="number"
                placeholder={t('bedrooms') || 'عدد الغرف'}
                error={errors.bedrooms?.message}
                icon={<LuBed className="text-[#63756F]" />}
                rules={{ 
                  required: t('bedroomsRequired') || "عدد الغرف مطلوب",
                  min: { value: 0, message: t('invalidNumber') || "رقم غير صحيح" }
                }}
              />

              {/* عدد الحمامات */}
              <InputComponent
                register={register}
                name="bathrooms"
                type="number"
                placeholder={t('bathrooms') || 'عدد الحمامات'}
                error={errors.bathrooms?.message}
                icon={<LuBath className="text-[#63756F]" />}
                rules={{ 
                  required: t('bathroomsRequired') || "عدد الحمامات مطلوب",
                  min: { value: 0, message: t('invalidNumber') || "رقم غير صحيح" }
                }}
              />

              {/* المساحة */}
              <InputComponent
                register={register}
                name="area"
                type="number"
                placeholder={t('area') || 'المساحة (م²)'}
                error={errors.area?.message}
                icon={<LuMaximize className="text-[#63756F]" />}
                rules={{ 
                  required: t('areaRequired') || "المساحة مطلوبة",
                  min: { value: 0, message: t('invalidNumber') || "رقم غير صحيح" }
                }}
              />

              {/* الموقع عربي */}
              <InputComponent
                register={register}
                name="location_ar"
                placeholder={t('locationAr') || 'الموقع بالعربية'}
                error={errors.location_ar?.message}
                icon={<LuMapPin className="text-[#63756F]" />}
                rules={{ 
                  required: t('locationRequired') || "الموقع مطلوب"
                }}
              />

              {/* الموقع إنجليزي */}
              <InputComponent
                register={register}
                name="location_en"
                placeholder={t('locationEn') || 'Location in English'}
                error={errors.location_en?.message}
                icon={<LuMapPin className="text-[#63756F]" />}
                rules={{ 
                  required: t('locationRequired') || "Location is required"
                }}
              />

              {/* اسم الشركة عربي */}
              <InputComponent
                register={register}
                name="company_name_ar"
                placeholder={t('companyAr') || 'اسم الشركة بالعربية'}
                error={errors.company_name_ar?.message}
                icon={<LuBuilding2 className="text-[#63756F]" />}
                rules={{ 
                  required: t('companyRequired') || "اسم الشركة مطلوب"
                }}
              />

              {/* اسم الشركة إنجليزي */}
              <InputComponent
                register={register}
                name="company_name_en"
                placeholder={t('companyEn') || 'Company name in English'}
                error={errors.company_name_en?.message}
                icon={<LuBuilding2 className="text-[#63756F]" />}
                rules={{ 
                  required: t('companyRequired') || "Company name is required"
                }}
              />
            </div>
          </div>

          {/* ========== القسم الثالث: المحتوى ========== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[#101820] mb-2">
                {t('contentAr') || 'الوصف بالعربية'}
              </label>
              <textarea
                {...register('content_ar', {
                  required: t('contentRequired') || "الوصف مطلوب",
                  minLength: {
                    value: 10,
                    message: t('descriptionShort') || "الوصف قصير جداً",
                  },
                  maxLength: {
                    value: 1000,
                    message: t('descriptionLong') || "الوصف طويل جداً",
                  },
                })}
                placeholder={t('contentArPlaceholder') || "أدخل وصف العقار بالعربية..."}
                className="bg-[#F6F4EE] p-4 h-[160px] rounded-2xl outline-none w-full resize-none border border-[#E7E1D6] focus:ring-2 focus:ring-[#0E6B58] transition"
              />
              {errors.content_ar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content_ar.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#101820] mb-2">
                {t('contentEn') || 'Description in English'}
              </label>
              <textarea
                {...register('content_en', {
                  required: t('contentRequired') || "Description is required",
                  minLength: {
                    value: 10,
                    message: t('descriptionShort') || "Description is too short",
                  },
                  maxLength: {
                    value: 1000,
                    message: t('descriptionLong') || "Description is too long",
                  },
                })}
                placeholder={t('contentEnPlaceholder') || "Enter property description in English..."}
                className="bg-[#F6F4EE] p-4 h-[160px] rounded-2xl outline-none w-full resize-none border border-[#E7E1D6] focus:ring-2 focus:ring-[#0E6B58] transition"
              />
              {errors.content_en && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content_en.message}
                </p>
              )}
            </div>
          </div>

          {/* ========== القسم الرابع: الميزات ========== */}
          <div className="bg-[#F6F4EE] rounded-3xl p-6 lg:p-8 border border-[#E7E1D6]">
            <h3 className="text-xl font-black text-[#101820] mb-4 flex items-center gap-3">
              <LuCheck size={24} className="text-[#0E6B58]" />
              {t('featuresTitle') || 'مميزات العقار'}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input
                    {...register(`features.${index}.value`, {
                      required: index === 0 ? t('featureRequired') || "مطلوب ميزة واحدة على الأقل" : false,
                    })}
                    placeholder={`${t('feature') || 'ميزة'} ${index + 1}`}
                    className="bg-white h-[54px] rounded-2xl px-5 w-full outline-none border border-[#E7E1D6] focus:ring-2 focus:ring-[#0E6B58] transition"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 font-bold w-12 h-[54px] rounded-2xl bg-red-50 hover:bg-red-100 transition flex items-center justify-center"
                      title={t('removeFeature') || "حذف الميزة"}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <button
              type="button"
              onClick={() => append({ value: '' })}
              className="mt-4 text-[#0E6B58] font-bold hover:text-[#C89B3C] transition flex items-center gap-2"
            >
              <span className="text-2xl">+</span>
              <span>{t('addFeature') || 'إضافة ميزة جديدة'}</span>
            </button>
          </div>

          {/* ========== القسم الخامس: التواصل ========== */}
          <div className="bg-[#F6F4EE] rounded-3xl p-6 lg:p-8 border border-[#E7E1D6]">
            <h3 className="text-xl font-black text-[#101820] mb-4 flex items-center gap-3">
              <LuPhone size={24} className="text-[#0E6B58]" />
              {t('contactInfo') || 'معلومات التواصل'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputComponent
                register={register}
                name="phone"
                type="tel"
                placeholder={t('phone') || 'رقم الهاتف'}
                error={errors.phone?.message}
                icon={<LuPhone className="text-[#63756F]" />}
                rules={{ 
                  required: t('phoneRequired') || "رقم الهاتف مطلوب",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: t('phoneInvalid') || "رقم هاتف غير صحيح"
                  }
                }}
              />

              <InputComponent
                register={register}
                name="mobile"
                type="tel"
                placeholder={t('mobile') || 'رقم الجوال'}
                error={errors.mobile?.message}
                icon={<LuSmartphone className="text-[#63756F]" />}
                rules={{ 
                  required: t('mobileRequired') || "رقم الجوال مطلوب",
                  pattern: {
                    value: /^[0-9]{10,15}$/,
                    message: t('mobileInvalid') || "رقم جوال غير صحيح"
                  }
                }}
              />
            </div>
          </div>

          {/* ========== زر الإرسال ========== */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full py-4 bg-gradient-to-r from-[#0E6B58] to-[#101820] text-white rounded-2xl font-black text-lg hover:shadow-[0_20px_50px_rgba(14,107,88,0.3)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {submitting ? (
              <>
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></span>
                <span>{t('submitting') || 'جاري الإرسال...'}</span>
              </>
            ) : (
              <>
                <LuSend size={22} />
                <span>{t('submit') || 'إضافة العقار'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </Container>
  );
}