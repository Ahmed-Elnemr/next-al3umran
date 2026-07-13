'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import wallet from '@/public/images/wallet.png';
import sar from '@/public/images/sar.png';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import apiServiceCall from '@/lib/apiServiceCall';
import { useLocale, useTranslations } from 'next-intl';

interface Bank {
  id: number;
  name: string;
  number: string;
  iban: string;
  bank_name: string;
}

interface Operation {
  id: number;
  status: string;
  content: string;
  created_at: string;
}

interface AccountBalanceProps {
  balance: number;
  bank: Bank;
  operations: Operation[];
  token: string;
}

interface FormValues {
  amount: string;
}

const AccountBalance: React.FC<AccountBalanceProps> = ({ balance, bank, operations, token }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const locale = useLocale();
  const t = useTranslations('wallet');

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex flex-col gap-2 items-center justify-center py-4 bg-[#F4F8F6] border border-[#0E6B58]/10 rounded-[28px] w-full max-w-sm mb-6">
        <p className="text-xs font-bold text-[#5E6D68] uppercase tracking-wider">{t('wallet_balance')}</p>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black text-[#0E6B58]">{balance}</span>
          <Image src={sar} alt="sar" width={32} height={27} className="object-contain" />
        </div>
      </div>

      <div className="bg-[#F8F6F1] border border-[#E8E1D5] w-full max-w-md p-6 rounded-[24px] mb-6">
        <h4 className="text-xs font-bold text-[#7A8782] uppercase tracking-wider mb-2">
          {locale === 'ar' ? 'الحساب البنكي المرتبط' : 'Linked Bank Account'}
        </h4>
        <div className="space-y-1">
          <h3 className="text-lg font-black text-[#101820]">{bank.bank_name}</h3>
          <p className="text-sm font-bold text-[#5E6D68]">{bank.name}</p>
          <p className="text-xs font-medium text-[#7A8782] mt-2 break-all bg-white/50 px-3 py-1.5 rounded-lg border border-[#E8E1D5]/40">
            {bank.iban?.slice(0, 5)} ************** {bank.iban?.slice(-2)}
          </p>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-[#0E6B58] text-white py-4 px-6 rounded-full font-bold w-full max-w-md transition hover:bg-[#0a4e40] shadow-[0_14px_35px_rgba(14,107,88,0.2)] mb-8"
      >
        {t('withdraw_request')}
      </button>

      {operations?.length > 0 && (
        <div className="w-full max-w-md mt-6">
          <h3 className="text-lg font-black text-[#101820] mb-4 border-b border-[#E7E1D6] pb-2">
            {t('wallet_history')}
          </h3>
          <ul className="flex flex-col gap-3">
            {operations.map((operation) => (
              <li key={operation.id} className="bg-[#F6F4EE]/40 border border-[#E7E1D6]/70 p-4 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm font-bold text-[#101820] leading-relaxed">
                    {operation.content}
                  </span>
                  <span className="text-[11px] font-medium text-[#7A8782] shrink-0">{operation.created_at}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isModalOpen && (
        <WithdrawModal onClose={() => setIsModalOpen(false)} token={token} locale={locale} />
      )}
    </div>
  );
};

interface ModalProps {
  onClose: () => void;
  token: string;
  locale: string;
}

const WithdrawModal: React.FC<ModalProps> = ({ onClose, token, locale }) => {
  const t = useTranslations('wallet');
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await apiServiceCall({
        url: 'user/wallet/withdrawal/amount',
        method: 'POST',
        body: { amount: data.amount },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale
        }
      });

      toast.success(response?.message || t('request_sent_successfully'));
      reset();
      onClose();
    } catch (error: any) {
      const errorMsg = error?.data?.message || t('request_error');
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-[#F6F4EE] border border-[#E7E1D6] p-8 rounded-[28px] w-full max-w-md relative shadow-[0_30px_80px_rgba(16,24,32,0.15)] text-center">
        <button
          onClick={onClose}
          className="absolute top-4 end-4 text-gray-500 hover:text-black text-2xl transition"
        >
          &times;
        </button>
        <h2 className="text-2xl font-black text-[#101820] mb-2 mt-4">{t('withdraw_request')}</h2>
        <p className="text-[#5E6D68] mb-6 text-sm leading-relaxed">
          {t('withdraw_instruction')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="my-5 text-right">
          <InputComponent
            register={register}
            name="amount"
            type="text"
            placeholder={t('amount_placeholder')}
          />

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="submit"
              className="bg-[#0E6B58] text-white px-6 py-4 rounded-full font-bold w-full h-[58px] transition hover:bg-[#0a4e40] shadow-[0_14px_35px_rgba(14,107,88,0.2)]"
            >
              {t('send_request')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountBalance;
