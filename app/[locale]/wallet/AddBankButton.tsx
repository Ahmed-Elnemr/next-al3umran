"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import apiServiceCall from "@/lib/apiServiceCall";
import InputComponent from "@/components/shared/reusableComponents/InputComponent";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Landmark, CreditCard, Hash, Phone, User, MapPin, Wallet } from "lucide-react";

type FormValues = {
  method_type: 'bank' | 'cash' | 'wallet';
  // Bank fields
  bank_name: string;
  bank_account_holder: string;
  bank_iban: string;
  // Cash fields
  cash_network: string;
  cash_recipient_name: string;
  cash_recipient_phone: string;
  cash_city: string;
  // Wallet fields
  wallet_provider: string;
  wallet_number: string;
  wallet_owner: string;
};

const AddBankButton: React.FC<{ token: string }> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<'bank' | 'cash' | 'wallet'>('bank');
  
  const locale = useLocale();
  const t = useTranslations("wallet");
  const router = useRouter();
  const isAr = locale === "ar";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      method_type: 'bank',
      bank_name: '',
      bank_account_holder: '',
      bank_iban: '',
      cash_network: 'Al-Haram',
      cash_recipient_name: '',
      cash_recipient_phone: '',
      cash_city: '',
      wallet_provider: 'Zain Cash',
      wallet_number: '',
      wallet_owner: '',
    }
  });

  const onSubmit = async (data: FormValues) => {
    const payload = {
      bank_name: "",
      number: "",
      iban: ""
    };

    if (method === 'bank') {
      payload.bank_name = data.bank_name;
      payload.number = data.bank_account_holder; // store holder name here
      payload.iban = data.bank_iban;
    } else if (method === 'cash') {
      const networkLabel = data.cash_network === 'Al-Haram' ? (isAr ? 'الهرم' : 'Al-Haram') : (isAr ? 'الفؤاد' : 'Al-Fouad');
      payload.bank_name = `${isAr ? 'حوالة كاش' : 'Cash Transfer'} (${networkLabel})`;
      payload.number = data.cash_recipient_phone;
      payload.iban = `${data.cash_recipient_name} - ${data.cash_city}`;
    } else if (method === 'wallet') {
      payload.bank_name = `${isAr ? 'محفظة إلكترونية' : 'Mobile Wallet'} (${data.wallet_provider})`;
      payload.number = data.wallet_number;
      payload.iban = data.wallet_owner;
    }

    try {
      const response = await apiServiceCall({
        url: "user/wallet/add-account",
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });

      toast.success(response?.message || (isAr ? "تم ربط وسيلة الدفع بنجاح" : "Payment method linked successfully"));
      reset();
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || error?.data?.message || t("error");
      toast.error(errorMsg);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#0E6B58] mx-auto mt-8 w-full sm:w-[414px] flex items-center justify-center gap-2 h-[54px] sm:h-[64px] rounded-full text-white font-bold transition hover:bg-[#0a4e40] shadow-[0_14px_35px_rgba(14,107,88,0.2)]"
      >
        {isAr ? "ربط وسيلة استلام الأرباح" : "Link Withdrawal Method"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
          <div className="bg-[#F6F4EE] border border-[#E7E1D6] p-8 rounded-[28px] w-full max-w-lg text-center relative shadow-[0_30px_80px_rgba(16,24,32,0.15)] max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 end-4 text-gray-500 hover:text-black text-2xl transition"
              aria-label="Close Modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-black text-[#101820] mb-2 mt-4">
              {isAr ? "إضافة وسيلة سحب" : "Add Withdrawal Method"}
            </h2>
            <p className="text-[#5E6D68] mb-6 text-sm leading-relaxed">
              {isAr ? "اختر وسيلة الدفع المتوافقة مع دولتك لاستلام أرباحك وعوائدك العقارية" : "Choose the payment method compatible with your country to receive your earnings"}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-[#E7E1D6]">
              <button
                type="button"
                onClick={() => setMethod('bank')}
                className={`py-2 px-3 text-xs font-black rounded-xl transition ${method === 'bank' ? 'bg-[#0E6B58] text-white shadow-sm' : 'text-[#5E6D68] hover:bg-[#F6F4EE]'}`}
              >
                {isAr ? "حساب بنكي" : "Bank"}
              </button>
              <button
                type="button"
                onClick={() => setMethod('cash')}
                className={`py-2 px-3 text-xs font-black rounded-xl transition ${method === 'cash' ? 'bg-[#0E6B58] text-white shadow-sm' : 'text-[#5E6D68] hover:bg-[#F6F4EE]'}`}
              >
                {isAr ? "حوالة كاش" : "Cash"}
              </button>
              <button
                type="button"
                onClick={() => setMethod('wallet')}
                className={`py-2 px-3 text-xs font-black rounded-xl transition ${method === 'wallet' ? 'bg-[#0E6B58] text-white shadow-sm' : 'text-[#5E6D68] hover:bg-[#F6F4EE]'}`}
              >
                {isAr ? "محفظة هاتف" : "Wallet"}
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 text-right"
              dir={isAr ? "rtl" : "ltr"}
            >
              {method === 'bank' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "اسم البنك" : "Bank Name"}
                    </label>
                    <InputComponent
                      register={register}
                      name="bank_name"
                      placeholder={isAr ? "مثال: بنك دبي الإسلامي" : "e.g. Dubai Islamic Bank"}
                      error={errors.bank_name?.message || ""}
                      icon={<Landmark className="text-[#7A8782]" size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "اسم صاحب الحساب" : "Account Holder Name"}
                    </label>
                    <InputComponent
                      register={register}
                      name="bank_account_holder"
                      placeholder={isAr ? "الاسم الكامل لصاحب الحساب" : "Full Name"}
                      error={errors.bank_account_holder?.message || ""}
                      icon={<User className="text-[#7A8782]" size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "رقم الآيبان (IBAN) أو رقم الحساب" : "IBAN / Account Number"}
                    </label>
                    <InputComponent
                      register={register}
                      name="bank_iban"
                      placeholder={isAr ? "أدخل رقم الحساب أو الآيبان" : "Enter IBAN or Account Number"}
                      error={errors.bank_iban?.message || ""}
                      icon={<Hash className="text-[#7A8782]" size={18} />}
                    />
                  </div>
                </>
              )}

              {method === 'cash' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "شبكة التحويل" : "Transfer Network"}
                    </label>
                    <select
                      {...register("cash_network")}
                      className="bg-white w-full h-[50px] md:h-[64px] px-4 border border-[#E7E1D6] rounded-xl outline-none transition text-sm font-bold text-[#101820] mb-4"
                    >
                      <option value="Al-Haram">{isAr ? "شركة الهرم للصرافة" : "Al-Haram Transfer"}</option>
                      <option value="Al-Fouad">{isAr ? "شركة الفؤاد للصرافة" : "Al-Fouad Transfer"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "اسم المستلم الكامل (ثلاثي)" : "Recipient Full Name"}
                    </label>
                    <InputComponent
                      register={register}
                      name="cash_recipient_name"
                      placeholder={isAr ? "يجب أن يطابق البطاقة الشخصية" : "Must match ID card"}
                      error={errors.cash_recipient_name?.message || ""}
                      icon={<User className="text-[#7A8782]" size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "رقم جوال المستلم" : "Recipient Mobile Number"}
                    </label>
                    <InputComponent
                      register={register}
                      name="cash_recipient_phone"
                      placeholder="09xxxxxxxx"
                      error={errors.cash_recipient_phone?.message || ""}
                      icon={<Phone className="text-[#7A8782]" size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "المدينة والفرع المفضل" : "City & Branch"}
                    </label>
                    <InputComponent
                      register={register}
                      name="cash_city"
                      placeholder={isAr ? "مثال: دمشق - فرع الحلبوني" : "e.g. Damascus - Halbouni Branch"}
                      error={errors.cash_city?.message || ""}
                      icon={<MapPin className="text-[#7A8782]" size={18} />}
                    />
                  </div>
                </>
              )}

              {method === 'wallet' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "نوع المحفظة" : "Wallet Provider"}
                    </label>
                    <select
                      {...register("wallet_provider")}
                      className="bg-white w-full h-[50px] md:h-[64px] px-4 border border-[#E7E1D6] rounded-xl outline-none transition text-sm font-bold text-[#101820] mb-4"
                    >
                      <option value="Syriatel Cash">{isAr ? "سيريتل كاش (سوريا)" : "Syriatel Cash (Syria)"}</option>
                      <option value="MTN Cash">{isAr ? "إم تي إن كاش (سوريا)" : "MTN Cash (Syria)"}</option>
                      <option value="Zain Cash">{isAr ? "زين كاش (العراق)" : "Zain Cash (Iraq)"}</option>
                      <option value="AsiaPay">{isAr ? "آسيا باي (العراق)" : "AsiaPay (Iraq)"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "رقم حساب المحفظة" : "Wallet Account Number"}
                    </label>
                    <InputComponent
                      register={register}
                      name="wallet_number"
                      placeholder={isAr ? "رقم الهاتف المرتبط بالمحفظة" : "Phone number linked to wallet"}
                      error={errors.wallet_number?.message || ""}
                      icon={<Phone className="text-[#7A8782]" size={18} />}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#5E6D68] mb-1.5 mr-1">
                      {isAr ? "اسم صاحب المحفظة" : "Wallet Owner Name"}
                    </label>
                    <InputComponent
                      register={register}
                      name="wallet_owner"
                      placeholder={isAr ? "الاسم الكامل المسجل بالمحفظة" : "Full Name"}
                      error={errors.wallet_owner?.message || ""}
                      icon={<User className="text-[#7A8782]" size={18} />}
                    />
                  </div>
                </>
              )}

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-[#0E6B58] text-white py-2 px-4 rounded-full font-bold w-full h-[58px] transition hover:bg-[#0a4e40] shadow-[0_14px_35px_rgba(14,107,88,0.2)]"
                >
                  {isAr ? "تأكيد وحفظ" : "Confirm & Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBankButton;
