"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import CustomSelect from "@/components/shared/reusableComponents/CustomSelect";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-toastify";
import ConfirmMobile from "./ConfirmMobile";
import { User, Lock, Phone, AlertCircle, Camera, Check, Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { apiErrorMessage } from "@/lib/apiServiceCall";
import { envelopeList, getCities, getProfile, localizedText, updateProfile, changePhone, deleteProfile } from "@/lib/api/client";
import { useRouter } from "next/navigation";

type FormDataType = {
  name: string;
  company_name?: string;
  email: string;
  phone: string;
  city_id: string;
  commercial_register?: string;
  company_bio?: string;
  profile_image?: FileList;
  
  // Phone Tab
  country_code?: string;
  new_phone?: string;
};

const EditDataForm = ({
  token,
  role,
}: {
  token: string;
  role: string;
}) => {
  const { register, handleSubmit, setValue, control, watch, resetField } = useForm<FormDataType>();
  
  // States
  const [activeTab, setActiveTab] = useState<"profile" | "phone" | "danger">("profile");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();
  const t = useTranslations("profile");
  const router = useRouter();
  const isAr = locale === "ar";
  const isCompany = role === "company";

  const profileImage = watch("profile_image");
  const { ref: imageRegisterRef, ...imageRegister } = register("profile_image");

  // Fetch initial data
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const response = await getProfile(locale, token);
        const userData = response?.data?.user ?? response?.data;
        if (!userData) return;

        setValue("name", userData.name || "");
        setValue("email", userData.email || "");
        setValue("phone", userData.phone || "");
        if (userData.country_code) {
          setValue("country_code", userData.country_code);
        } else {
          setValue("country_code", "+971"); // default
        }
        if (userData.city_id) {
          setValue("city_id", String(userData.city_id));
        }

        const avatar = userData.avatar || userData.profile_image_url;
        if (avatar) {
          setPreviewImage(avatar);
        }

        if (isCompany) {
          setValue("company_name", localizedText(userData.company_name, locale));
          setValue("commercial_register", userData.commercial_register || "");
          setValue("company_bio", localizedText(userData.company_bio, locale));
        }
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(apiErrorMessage(error, t("fetchDataError")));
      }
    };

    fetchData();
  }, [setValue, token, isCompany, locale, t]);

  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [profileImage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Submit Profile Data
  const onSubmitProfile = async (data: FormDataType) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("_method", "PUT");

      if (data.name) formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.city_id) formData.append("city_id", data.city_id);

      if (isCompany) {
        if (data.company_name) formData.append("company_name", data.company_name);
        if (data.commercial_register) formData.append("commercial_register", data.commercial_register);
        if (data.company_bio) formData.append("company_bio", data.company_bio);
        if (!data.name && data.company_name) formData.append("name", data.company_name);
      }

      if (data.profile_image?.[0]) {
        formData.append("avatar", data.profile_image[0]);
        formData.append("profile_image", data.profile_image[0]);
      }

      const response = await updateProfile(locale, token, formData);
      
      // Update local storage and cookie so Navbar reflects new name immediately
      if (typeof window !== "undefined") {
        try {
          const cookieStr = document.cookie
            .split("; ")
            .find((row) => row.startsWith("userDataInfo="))
            ?.split("=")[1];
          if (cookieStr) {
            const parsed = JSON.parse(decodeURIComponent(cookieStr));
            if (data.name) parsed.name = data.name;
            if (isCompany && data.company_name) parsed.company_name = data.company_name;
            // update cookie
            document.cookie = `userDataInfo=${encodeURIComponent(JSON.stringify(parsed))}; path=/`;
            localStorage.setItem("alomran_current_user", JSON.stringify(parsed));
          }
        } catch (e) {}
      }
      
      toast.success(response?.message || t("updateSuccess"));
      router.refresh();
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(apiErrorMessage(error, t("updateError")));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Phone Change
  const onSubmitPhone = async (data: FormDataType) => {
    if (!data.new_phone || !data.country_code) {
      toast.error(isAr ? "يرجى إدخال رقم الهاتف وكود الدولة" : "Please enter phone and country code");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        country_code: data.country_code,
        phone: data.new_phone
      };

      const response = await changePhone(locale, token, payload);
      setMobileNumber(data.country_code + data.new_phone);
      setShowOtpModal(true);
      toast.success(response?.message || (isAr ? "تم إرسال رمز التحقق بنجاح" : "OTP sent successfully"));
    } catch (error: any) {
      console.error("Phone change error:", error);
      toast.error(apiErrorMessage(error, isAr ? "فشل طلب تغيير الهاتف" : "Failed to request phone change"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Delete Account
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    setShowDeleteModal(false);
    try {
      const response = await deleteProfile(locale, token);
      
      if (typeof window !== "undefined") {
        localStorage.removeItem("alomran_current_user");
      }
      
      fetch("/api/auth/logout", { method: "GET" }).finally(() => {
        toast.success(response?.message || (isAr ? "تم حذف الحساب بنجاح" : "Account deleted successfully"));
        window.location.href = `/${locale}`;
      });
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast.error(apiErrorMessage(error, isAr ? "فشل حذف الحساب" : "Failed to delete account"));
      setIsSubmitting(false);
    }
  };

  const { data: citiesData } = useQuery({
    queryKey: ["cities", locale],
    queryFn: () => getCities(locale),
    select: (data) =>
      envelopeList(data).map((city: any) => ({
        value: String(city.id),
        label: city.name || city.title || "",
      })),
  });

  const tabs = [
    { id: "profile", label: isAr ? "البيانات الأساسية" : "Profile Info", icon: <User size={18} /> },
    { id: "phone", label: isAr ? "تغيير رقم الهاتف" : "Change Phone", icon: <Phone size={18} /> },
    { id: "danger", label: isAr ? "حذف الحساب" : "Delete Account", icon: <Trash2 size={18} />, danger: true },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-72 bg-[#F9F8F6] border-b lg:border-b-0 lg:border-e border-[#E7E1D6] flex flex-col p-6 lg:p-8 shrink-0">
        <h3 className="text-lg font-black text-[#101820] mb-6">
          {isAr ? "إعدادات الحساب" : "Account Settings"}
        </h3>
        
        <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? tab.danger 
                    ? "bg-[#FFEBEB] text-[#EB2302]" 
                    : "bg-[#0E6B58] text-white shadow-lg shadow-[#0E6B58]/20"
                  : "text-[#63756F] hover:bg-white hover:text-[#101820]"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-10">
        
        {/* TAB 1: PROFILE INFO */}
        {activeTab === "profile" && (
          <form onSubmit={handleSubmit(onSubmitProfile)} className="max-w-3xl animate-fade-in space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer" onClick={handleUploadClick}>
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center relative">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Profile"
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <User size={40} className="text-gray-300" />
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={28} />
                  </div>
                </div>
                <input
                  type="file"
                  {...imageRegister}
                  accept="image/*"
                  ref={(e) => {
                    imageRegisterRef(e);
                    // @ts-ignore
                    fileInputRef.current = e;
                  }}
                  className="hidden"
                />
              </div>
              
              <div>
                <h4 className="text-xl font-black text-[#101820]">
                  {isAr ? "الصورة الشخصية" : "Profile Picture"}
                </h4>
                <p className="text-sm text-[#63756F] mt-1">
                  {isAr ? "نوصي بصورة مربعة لا تقل عن 256 بيكسل." : "We recommend a square image, at least 256x256px."}
                </p>
                <button type="button" onClick={handleUploadClick} className="mt-3 text-sm font-bold text-[#0E6B58] hover:underline">
                  {isAr ? "تغيير الصورة" : "Change Picture"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {!isCompany && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#101820] mb-2">{t("name")}</label>
                  <input {...register("name")} type="text" className="w-full h-14 rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] px-4 font-bold text-[#101820] outline-none focus:border-[#0E6B58] transition" />
                </div>
              )}

              {isCompany && (
                <>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#101820] mb-2">{t("companyName")}</label>
                    <input {...register("company_name")} type="text" className="w-full h-14 rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] px-4 font-bold text-[#101820] outline-none focus:border-[#0E6B58] transition" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#101820] mb-2">{t("commercialRegister")}</label>
                    <input {...register("commercial_register")} type="text" className="w-full h-14 rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] px-4 font-bold text-[#101820] outline-none focus:border-[#0E6B58] transition" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#101820] mb-2">{t("companyBio")}</label>
                    <textarea {...register("company_bio")} rows={4} className="w-full rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] p-4 font-bold text-[#101820] outline-none focus:border-[#0E6B58] transition resize-none" />
                  </div>
                </>
              )}

              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-[#101820] mb-2">{t("email")}</label>
                <input {...register("email")} type="email" className="w-full h-14 rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] px-4 font-bold text-[#101820] outline-none focus:border-[#0E6B58] transition" />
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-[#101820] mb-2">{t("city")}</label>
                <div className="w-full">
                  <CustomSelect
                    name="city_id"
                    control={control}
                    options={citiesData || []}
                    placeholder={t("city")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E7E1D6]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-10 bg-[#0E6B58] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#095746] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#0E6B58]/20"
              >
                {isSubmitting ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Check size={18} />
                    <span>{isAr ? "حفظ التعديلات" : "Save Changes"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: PHONE */}
        {activeTab === "phone" && (
          <div className="max-w-xl animate-fade-in space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#101820] mb-2">
                {isAr ? "تغيير رقم الهاتف" : "Change Phone Number"}
              </h2>
              <p className="text-sm text-[#63756F] mb-8">
                {isAr ? "عند تغيير رقم الهاتف سيتم إرسال رمز تحقق للرقم الجديد للتأكد من ملكيته." : "An OTP will be sent to the new number to verify ownership."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#EEF6F3] border border-[#DCEBE5] flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <Phone size={20} className="text-[#0E6B58]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#63756F] mb-1">{isAr ? "رقم الهاتف الحالي" : "Current Phone Number"}</p>
                <div dir="ltr" className={`inline-block ${isAr ? "text-right" : "text-left"}`}>
                  <p className="text-lg font-black text-[#0E6B58]">{watch("country_code")} {watch("phone")}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitPhone)} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#101820] mb-2">
                  {isAr ? "رقم الهاتف الجديد" : "New Phone Number"}
                </label>
                <div className="flex gap-3" dir="ltr">
                  <input 
                    {...register("country_code")} 
                    type="text" 
                    placeholder="+971"
                    className="w-24 h-14 rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] text-center font-black text-[#101820] outline-none focus:border-[#0E6B58] transition" 
                  />
                  <input 
                    {...register("new_phone")} 
                    type="tel" 
                    placeholder="50XXXXXXX"
                    className="flex-1 h-14 rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] px-4 font-bold text-[#101820] outline-none focus:border-[#0E6B58] transition tracking-wider" 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#101820] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#0E6B58] transition-all disabled:opacity-70 shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>{isAr ? "إرسال رمز التحقق" : "Send Verification Code"}</span>
                      {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: DANGER ZONE */}
        {activeTab === "danger" && (
          <div className="max-w-xl animate-fade-in space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#EB2302] mb-2 flex items-center gap-2">
                <AlertCircle size={24} />
                <span>{isAr ? "منطقة الخطر" : "Danger Zone"}</span>
              </h2>
              <p className="text-sm text-[#63756F] mb-8">
                {isAr 
                  ? "تنبيه: حذف الحساب سيؤدي إلى فقدان جميع بياناتك وعقاراتك وحجوزاتك بشكل نهائي، ولا يمكن التراجع عن هذه الخطوة." 
                  : "Warning: Deleting your account will permanently remove all your data, properties, and bookings. This cannot be undone."}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#FFEBEB] border border-[#FFD6D6] space-y-6">
              <div>
                <h4 className="text-lg font-black text-[#101820] mb-2">
                  {isAr ? "هل تريد حقاً حذف حسابك؟" : "Do you really want to delete your account?"}
                </h4>
                <p className="text-sm text-[#EB2302] font-bold">
                  {isAr ? "سيتم مسح كافة التفاصيل الخاصة بك من خوادمنا." : "All your details will be erased from our servers."}
                </p>
              </div>

              <button
                onClick={handleDeleteAccount}
                disabled={isSubmitting}
                className="w-full h-14 bg-[#EB2302] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#d02c00] transition-all disabled:opacity-70 shadow-lg shadow-[#EB2302]/20"
              >
                {isSubmitting ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>{isAr ? "تأكيد حذف الحساب نهائياً" : "Confirm Permanent Deletion"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Verification Modal for Phone Change */}
      <ConfirmMobile
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        countryCode={watch("country_code") || ""}
        phone={watch("new_phone") || ""}
        token={token}
        formData={{
          name: watch("name"),
          email: watch("email"),
          phone: watch("phone"),
          city_id: watch("city_id"),
        }}
        onVerificationSuccess={() => {
          setShowOtpModal(false);
          toast.success(isAr ? "تم تحديث رقم الهاتف بنجاح" : "Phone updated successfully");
          setValue("phone", watch("new_phone") || "");
          setValue("new_phone", "");
          setActiveTab("profile");
        }}
      />

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center !z-[9999999] p-4">
          <div className="bg-white relative rounded-[15px] p-6 w-full max-w-md flex flex-col items-center text-center shadow-2xl animate-fade-in">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl transition"
              aria-label="Close Modal"
            >
              &times;
            </button>
            <div className="w-16 h-16 rounded-full bg-[#FFEBEB] flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-[#EB2302]" />
            </div>
            <h2 className="text-[22px] font-extrabold mb-2 text-[#101820]">
              {isAr ? "هل أنت متأكد من حذف الحساب؟" : "Are you sure you want to delete your account?"}
            </h2>
            <p className="mb-8 text-[#63756F] font-medium text-sm px-4">
              {isAr ? "حذف الحساب سيؤدي إلى فقدان جميع بياناتك وعقاراتك بشكل نهائي، ولا يمكن التراجع عن هذه الخطوة." : "This will permanently remove all your data and properties. This action cannot be undone."}
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-[#F9F8F6] text-[#101820] border border-[#E7E1D6] rounded-2xl font-bold hover:bg-gray-100 transition"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-[#EB2302] text-white rounded-2xl font-bold hover:bg-[#d02c00] transition disabled:opacity-70 flex items-center justify-center shadow-lg shadow-[#EB2302]/20"
              >
                {isSubmitting ? (
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  isAr ? "تأكيد الحذف" : "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDataForm;
