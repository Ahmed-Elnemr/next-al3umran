'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { fetchClient } from '@/lib/api/client';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Landmark,
  FileText,
  Upload,
  X,
  Building2,
  CreditCard,
  User,
  Hash,
  CheckCircle2,
  Clock,
  Send,
  Save,
} from 'lucide-react';
import apiServiceCall, { apiErrorMessage } from '@/lib/apiServiceCall';

interface BankAccount {
  id?: number | string;
  bank_name?: string;
  account_name?: string;
  number?: string;
  iban?: string;
  name?: string;
}

interface WalletOperation {
  id: number | string;
  status?: string;
  content?: string;
  amount?: number | string;
  type?: string;
  created_at?: string;
}

interface WalletClientViewProps {
  balance: number;
  bank: BankAccount | null;
  operations: WalletOperation[];
  token?: string;
}

export default function WalletClientView({
  balance: initialBalance,
  bank: initialBank,
  operations: initialOperations,
  token,
}: WalletClientViewProps) {
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === 'ar';

  const [balance, setBalance] = useState<number>(initialBalance || 0);
  const [bank, setBank] = useState<BankAccount | null>(initialBank);
  const [operations, setOperations] = useState<WalletOperation[]>(initialOperations || []);
  const [currencyLabel, setCurrencyLabel] = useState<string>('');

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof window === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const activeToken = token || getCookie('token');
    if (activeToken) {
      fetchClient('client/wallet', locale, { token: activeToken })
        .then((res: any) => {
          const walData = res?.data ?? res;
          const rawBal = walData?.balance ?? walData?.amount;
          if (rawBal !== undefined && rawBal !== null) {
            setBalance(Number(rawBal));
          }
          if (walData?.currency_label || walData?.currency) {
            setCurrencyLabel(walData.currency_label || walData.currency);
          }
          if (walData?.bank) {
            setBank(walData.bank);
            setBankForm({
              bank_name: walData.bank.bank_name || '',
              account_name: walData.bank.account_name || walData.bank.name || '',
              iban: walData.bank.iban || '',
              number: walData.bank.number || '',
            });
          }
          if (Array.isArray(walData?.operations)) {
            setOperations(walData.operations);
          }
        })
        .catch((err) => {
          console.warn('Failed to fetch wallet from client/wallet:', err);
        });
    }
  }, [locale, token]);

  // Modal states
  const [activeModal, setActiveModal] = useState<'bank' | 'charge' | 'withdraw' | null>(null);

  // Bank Form State
  const [bankForm, setBankForm] = useState({
    bank_name: bank?.bank_name || '',
    account_name: bank?.account_name || bank?.name || '',
    iban: bank?.iban || '',
    number: bank?.number || '',
  });

  // Charge Form State
  const [chargeForm, setChargeForm] = useState({
    amount: '',
    note: '',
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  // Withdraw Form State
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit Bank Account (POST client/wallet/bank-account)
  const handleBankSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bank_name.trim()) {
      toast.error(isAr ? 'يرجى إدخال اسم البنك' : 'Please enter bank name');
      return;
    }
    if (!bankForm.account_name.trim()) {
      toast.error(isAr ? 'يرجى إدخال اسم صاحب الحساب' : 'Please enter account name');
      return;
    }
    if (!bankForm.number.trim()) {
      toast.error(isAr ? 'يرجى إدخال رقم الحساب' : 'Please enter account number');
      return;
    }
    if (!bankForm.iban.trim()) {
      toast.error(isAr ? 'يرجى إدخال رقم الآيبان' : 'Please enter IBAN');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        bank_name: bankForm.bank_name.trim(),
        account_name: bankForm.account_name.trim(),
        iban: bankForm.iban.trim(),
        number: bankForm.number.trim(),
      };

      const res = await apiServiceCall({
        url: 'client/wallet/bank-account',
        method: 'POST',
        body: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });

      const message = res?.message || (isAr ? 'تم حفظ الحساب البنكي بنجاح' : 'Bank account saved successfully');
      toast.success(message);
      setBank(payload);
      setActiveModal(null);
      router.refresh();
    } catch (err: any) {
      toast.error(apiErrorMessage(err, isAr ? 'تعذر حفظ الحساب البنكي' : 'Failed to save bank account'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Charge Request (POST client/wallet/charge-requests)
  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(chargeForm.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error(isAr ? 'يرجى إدخال مبلغ شحن صحيح' : 'Please enter a valid charge amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('amount', String(numAmount));
      formData.append('note', chargeForm.note.trim());
      if (receiptFile) {
        formData.append('receipt', receiptFile);
      }

      const res = await apiServiceCall({
        url: 'client/wallet/charge-requests',
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });

      const message = res?.message || (isAr ? 'تم إرسال طلب الشحن بنجاح' : 'Charge request submitted successfully');
      toast.success(message);
      setChargeForm({ amount: '', note: '' });
      setReceiptFile(null);
      setReceiptPreview(null);
      setActiveModal(null);
      router.refresh();
    } catch (err: any) {
      toast.error(apiErrorMessage(err, isAr ? 'تعذر إرسال طلب الشحن' : 'Failed to submit charge request'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Withdraw Request (POST client/wallet/withdraw-requests)
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(withdrawAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error(isAr ? 'يرجى إدخال مبلغ سحب صحيح' : 'Please enter a valid withdraw amount');
      return;
    }

    if (numAmount > balance) {
      toast.error(isAr ? 'المبلغ المطلوب أكبر من رصيد المحفظة المتاح' : 'Amount exceeds available balance');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiServiceCall({
        url: 'client/wallet/withdraw-requests',
        method: 'POST',
        body: { amount: numAmount },
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });

      const message = res?.message || (isAr ? 'تم إرسال طلب السحب بنجاح' : 'Withdraw request submitted successfully');
      toast.success(message);
      setBalance((prev) => Math.max(0, prev - numAmount));
      setWithdrawAmount('');
      setActiveModal(null);
      router.refresh();
    } catch (err: any) {
      toast.error(apiErrorMessage(err, isAr ? 'تعذر إرسال طلب السحب' : 'Failed to submit withdraw request'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="w-full max-w-4xl mx-auto space-y-8">

      {/* Main Balance Overview Box */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#101820] via-[#162923] to-[#0E6B58] p-8 lg:p-10 text-white shadow-[0_20px_50px_rgba(14,107,88,0.2)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E6B58]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C89B3C]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Right Side Info (Balance) */}
          <div className={isAr ? 'text-right' : 'text-left'}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold mb-4 backdrop-blur-md">
              <Wallet size={16} className="text-[#C89B3C]" />
              <span>{isAr ? 'المحفظة الإلكترونية' : 'Digital Wallet'}</span>
            </div>

            <p className="text-white/70 text-xs font-bold uppercase tracking-wider">
              {isAr ? 'رصيدك المتاح حالياً' : 'Available Balance'}
            </p>

            <div className="flex items-baseline gap-3 mt-2">
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-white">
                {typeof balance === 'number' && !isNaN(balance) ? balance.toLocaleString('en-US') : (balance || 0)}
              </h2>
              <span className="text-lg font-bold text-[#C89B3C]">
                {currencyLabel || (isAr ? 'درهم إماراتي' : 'AED')}
              </span>
            </div>
          </div>

          {/* Left Side Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveModal('charge')}
              className="flex items-center justify-center gap-2.5 h-12 px-6 rounded-2xl bg-[#0E6B58] text-white font-black text-xs sm:text-sm hover:bg-[#095746] transition-all shadow-md hover:scale-105 cursor-pointer border border-white/10"
            >
              <ArrowDownLeft size={18} />
              <span>{isAr ? 'شحن المحفظة' : 'Top Up Wallet'}</span>
            </button>

            <button
              onClick={() => setActiveModal('withdraw')}
              className="flex items-center justify-center gap-2.5 h-12 px-6 rounded-2xl bg-[#C89B3C] text-[#101820] font-black text-xs sm:text-sm hover:bg-[#d8aa49] transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <ArrowUpRight size={18} />
              <span>{isAr ? 'طلب سحب' : 'Withdraw Payout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Linked Bank Account Card */}
      <div className="rounded-[28px] bg-white border border-[#E7E1D6] p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center shrink-0">
              <Landmark size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#101820]">
                {isAr ? 'الحساب البنكي المرتبط' : 'Linked Bank Account'}
              </h3>
              <p className="text-xs text-[#63756F] mt-0.5">
                {isAr ? 'تُحول المسحوبات والعوائد مباشرة إلى هذا الحساب' : 'Withdrawals are transferred directly to this account'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('bank')}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-2xl border border-[#0E6B58] text-[#0E6B58] font-extrabold text-xs hover:bg-[#EEF6F3] transition cursor-pointer"
          >
            <Building2 size={16} />
            <span>{bank ? (isAr ? 'تعديل البيانات' : 'Edit Account') : (isAr ? 'ربط حساب بنكي' : 'Link Bank Account')}</span>
          </button>
        </div>

        {bank ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#F9F8F6] rounded-2xl p-5 border border-[#E7E1D6]">
            <div>
              <p className="text-xs text-[#63756F] font-bold">{isAr ? 'اسم البنك' : 'Bank Name'}</p>
              <p className="text-sm font-black text-[#101820] mt-1">{bank.bank_name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#63756F] font-bold">{isAr ? 'صاحب الحساب' : 'Account Holder'}</p>
              <p className="text-sm font-black text-[#101820] mt-1">{bank.account_name || bank.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#63756F] font-bold">{isAr ? 'رقم الحساب' : 'Account Number'}</p>
              <p className="text-sm font-black text-[#101820] mt-1">{bank.number || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#63756F] font-bold">{isAr ? 'الآيبان (IBAN)' : 'IBAN'}</p>
              <p className="text-sm font-black text-[#101820] mt-1 break-all">{bank.iban || '-'}</p>
            </div>
          </div>
        ) : (
          <div className="bg-[#F9F8F6] border border-dashed border-[#DCE6E2] rounded-2xl p-6 text-center">
            <p className="text-sm text-[#63756F] font-bold">
              {isAr ? 'لم تقم بربط حساب بنكي بعد لاستلام أرباحك ومستحقاتك.' : 'No bank account linked yet for withdrawals.'}
            </p>
          </div>
        )}
      </div>

      {/* Wallet Operations / History */}
      <div className="rounded-[28px] bg-white border border-[#E7E1D6] p-6 lg:p-8 shadow-sm">
        <h3 className="text-lg font-black text-[#101820] mb-6 flex items-center gap-2">
          <FileText size={20} className="text-[#0E6B58]" />
          <span>{isAr ? 'سجل العمليات والمحفظة' : 'Transaction History'}</span>
        </h3>

        {operations.length > 0 ? (
          <div className="space-y-3">
            {operations.map((op) => (
              <div
                key={op.id}
                className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#F9F8F6] border border-[#E7E1D6] hover:border-[#0E6B58]/30 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#101820]">{op.content || (isAr ? 'عملية محفظة' : 'Wallet Operation')}</p>
                    {op.created_at && (
                      <p className="text-xs text-[#63756F] flex items-center gap-1 mt-0.5">
                        <Clock size={12} />
                        <span>{op.created_at}</span>
                      </p>
                    )}
                  </div>
                </div>

                {op.amount && (
                  <span className="text-sm font-black text-[#0E6B58]">
                    {op.amount} {isAr ? 'درهم' : 'AED'}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[#63756F]">
            <p className="text-sm font-bold">{isAr ? 'لا توجد عمليات سابقة بالمحفظة' : 'No previous transactions found'}</p>
          </div>
        )}
      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. BANK ACCOUNT MODAL (POST client/wallet/bank-account) */}
      {activeModal === 'bank' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[28px] border border-[#E7E1D6] p-6 lg:p-8 w-full max-w-lg relative shadow-2xl">
            {/* Close X Button */}
            <button
              onClick={() => setActiveModal(null)}
              className={`absolute top-6 ${isAr ? 'left-6' : 'right-6'} w-9 h-9 rounded-full bg-[#F6F4EE] hover:bg-[#0E6B58] hover:text-white flex items-center justify-center text-[#101820] transition cursor-pointer z-20`}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center shrink-0">
                <Landmark size={24} />
              </div>
              <div className={isAr ? 'text-right' : 'text-left'}>
                <h3 className="text-xl font-black text-[#101820]">
                  {isAr ? 'بيانات الحساب البنكي' : 'Bank Account Details'}
                </h3>
                <p className="text-xs text-[#63756F] mt-0.5">
                  {isAr ? 'يرجى كتابة البيانات بدقة لإجراء التحويلات' : 'Fill details accurately for payouts'}
                </p>
              </div>
            </div>

            <form onSubmit={handleBankSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'اسم البنك *' : 'Bank Name *'}
                </label>
                <div className="relative">
                  <Building2 size={18} className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                  <input
                    type="text"
                    value={bankForm.bank_name}
                    onChange={(e) => setBankForm((prev) => ({ ...prev, bank_name: e.target.value }))}
                    placeholder={isAr ? 'مثل: بنك دبي الإسلامي' : 'e.g. Dubai Islamic Bank'}
                    className={`w-full h-12 rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] text-sm text-[#101820] font-bold focus:border-[#0E6B58] outline-none transition ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'اسم صاحب الحساب *' : 'Account Name *'}
                </label>
                <div className="relative">
                  <User size={18} className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                  <input
                    type="text"
                    value={bankForm.account_name}
                    onChange={(e) => setBankForm((prev) => ({ ...prev, account_name: e.target.value }))}
                    placeholder={isAr ? 'الاسم الثلاثي المكتوب في البنك' : 'Full Name on Bank Account'}
                    className={`w-full h-12 rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] text-sm text-[#101820] font-bold focus:border-[#0E6B58] outline-none transition ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'رقم الحساب *' : 'Account Number *'}
                </label>
                <div className="relative">
                  <CreditCard size={18} className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                  <input
                    type="text"
                    value={bankForm.number}
                    onChange={(e) => setBankForm((prev) => ({ ...prev, number: e.target.value }))}
                    placeholder={isAr ? 'أدخل رقم الحساب البنكي' : 'Enter account number'}
                    className={`w-full h-12 rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] text-sm text-[#101820] font-bold focus:border-[#0E6B58] outline-none transition ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'رقم الآيبان (IBAN) *' : 'IBAN *'}
                </label>
                <div className="relative">
                  <Hash size={18} className={`absolute top-1/2 -translate-y-1/2 text-[#63756F] ${isAr ? 'right-3.5' : 'left-3.5'}`} />
                  <input
                    type="text"
                    value={bankForm.iban}
                    onChange={(e) => setBankForm((prev) => ({ ...prev, iban: e.target.value }))}
                    placeholder={isAr ? 'AE000000000000000000000' : 'AE000000000000000000000'}
                    className={`w-full h-12 rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] text-sm text-[#101820] font-bold focus:border-[#0E6B58] outline-none transition ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4 text-left'}`}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-[#0E6B58] text-white font-black text-sm hover:bg-[#095746] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 shadow-lg shadow-[#0E6B58]/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      {isAr ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      {isAr ? 'حفظ الحساب البنكي' : 'Save Bank Account'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CHARGE WALLET MODAL (POST client/wallet/charge-requests) */}
      {activeModal === 'charge' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[28px] border border-[#E7E1D6] p-6 lg:p-8 w-full max-w-lg relative shadow-2xl">
            {/* Close X Button */}
            <button
              onClick={() => setActiveModal(null)}
              className={`absolute top-6 ${isAr ? 'left-6' : 'right-6'} w-9 h-9 rounded-full bg-[#F6F4EE] hover:bg-[#0E6B58] hover:text-white flex items-center justify-center text-[#101820] transition cursor-pointer z-20`}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center shrink-0">
                <ArrowDownLeft size={24} />
              </div>
              <div className={isAr ? 'text-right' : 'text-left'}>
                <h3 className="text-xl font-black text-[#101820]">
                  {isAr ? 'طلب شحن المحفظة' : 'Wallet Charge Request'}
                </h3>
                <p className="text-xs text-[#63756F] mt-0.5">
                  {isAr ? 'أدخل المبلغ وملاحظتك وأرفق إيصال التحويل' : 'Enter amount, note and upload transfer receipt'}
                </p>
              </div>
            </div>

            <form onSubmit={handleChargeSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'المبلغ المراد شحنه (بالدرهم) *' : 'Amount (AED) *'}
                </label>
                <input
                  type="number"
                  step="any"
                  value={chargeForm.amount}
                  onChange={(e) => setChargeForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder={isAr ? 'مثال: 500' : 'e.g. 500'}
                  className={`w-full h-12 px-4 rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] text-sm text-[#101820] font-bold focus:border-[#0E6B58] outline-none transition ${isAr ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'ملاحظة التحويل' : 'Transfer Note'}
                </label>
                <textarea
                  rows={3}
                  value={chargeForm.note}
                  onChange={(e) => setChargeForm((prev) => ({ ...prev, note: e.target.value }))}
                  placeholder={isAr ? 'اكتب أي ملاحظة أو رقم العملية...' : 'Write transfer details or notes...'}
                  className={`w-full p-3 rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] text-sm text-[#101820] font-bold focus:border-[#0E6B58] outline-none transition resize-none ${isAr ? 'text-right' : 'text-left'}`}
                />
              </div>

              {/* Receipt File Upload */}
              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'إيصال التحويل (صورة/ملف)' : 'Transfer Receipt (File)'}
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#E7E1D6] hover:border-[#0E6B58] bg-[#F9F8F6] rounded-2xl cursor-pointer transition relative overflow-hidden">
                  {receiptPreview ? (
                    <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <Upload size={24} className="text-[#0E6B58] mb-2" />
                      <p className="text-xs font-bold text-[#101820]">
                        {receiptFile ? receiptFile.name : (isAr ? 'اضغط لرفع صورة أو ملف الإيصال' : 'Click to upload receipt image')}
                      </p>
                    </div>
                  )}
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleReceiptChange} />
                </label>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-[#0E6B58] text-white font-black text-sm hover:bg-[#095746] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 shadow-lg shadow-[#0E6B58]/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      {isAr ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {isAr ? 'إرسال طلب الشحن' : 'Submit Charge Request'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. WITHDRAW REQUEST MODAL (POST client/wallet/withdraw-requests) */}
      {activeModal === 'withdraw' && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[28px] border border-[#E7E1D6] p-6 lg:p-8 w-full max-w-lg relative shadow-2xl">
            {/* Close X Button */}
            <button
              onClick={() => setActiveModal(null)}
              className={`absolute top-6 ${isAr ? 'left-6' : 'right-6'} w-9 h-9 rounded-full bg-[#F6F4EE] hover:bg-[#0E6B58] hover:text-white flex items-center justify-center text-[#101820] transition cursor-pointer z-20`}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FBF7EE] text-[#C89B3C] flex items-center justify-center shrink-0">
                <ArrowUpRight size={24} />
              </div>
              <div className={isAr ? 'text-right' : 'text-left'}>
                <h3 className="text-xl font-black text-[#101820]">
                  {isAr ? 'طلب سحب الأرباح' : 'Withdrawal Request'}
                </h3>
                <p className="text-xs text-[#63756F] mt-0.5">
                  {isAr ? 'سيتم تحويل المبلغ المكتوب إلى حسابك البنكي المرتبط' : 'Amount will be sent to your linked bank account'}
                </p>
              </div>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold text-[#101820] mb-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'المبلغ المراد سحبه (بالدرهم) *' : 'Withdraw Amount (AED) *'}
                </label>
                <input
                  type="number"
                  step="any"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={isAr ? 'أدخل المبلغ المطلوب' : 'Enter amount'}
                  className={`w-full h-12 px-4 rounded-xl border border-[#E7E1D6] bg-[#F9F8F6] text-sm text-[#101820] font-bold focus:border-[#0E6B58] outline-none transition ${isAr ? 'text-right' : 'text-left'}`}
                />
                <p className={`text-[11px] text-[#63756F] mt-1.5 font-bold ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'رصيدك المتاح حالياً:' : 'Available Balance:'} {balance} {isAr ? 'درهم' : 'AED'}
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-[#C89B3C] text-[#101820] font-black text-sm hover:bg-[#d8aa49] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 shadow-lg shadow-[#C89B3C]/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-[#101820] border-t-transparent" />
                      {isAr ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={18} />
                      {isAr ? 'إرسال طلب السحب' : 'Submit Withdrawal'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
