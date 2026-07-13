import React from 'react';
import Container from '@/components/shared/container';
import wallet from '@/public/images/wallet-page.png';
import Image from 'next/image';
import AddBankButton from './AddBankButton';
import AccountBalance from './AccountBalance';
import apiServiceCall from '@/lib/apiServiceCall';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

import { redirect } from 'next/navigation';

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const role = cookieStore.get('client_type')?.value;

  if (token && role !== 'company') {
    redirect(`/${locale}`);
  }

  // if (!token) {
  //   redirect(`/${locale}/login`);
  // }

  const t = await getTranslations('wallet');

  let balance = 0;
  let bank = null;
  let operations = [];

  try {
    const walletResponse = await apiServiceCall({
      url: 'user/wallet/balance',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (walletResponse?.data) {
      balance = walletResponse.data.balance || 0;
      bank = walletResponse.data.bank || null;
      operations = walletResponse.data.operations || [];
    }
  } catch (error) {
    console.error('Failed to fetch wallet balance:', error);
  }

  const hasBankAccount = !!bank;

  return (
    <Container>
      <div className="flex my-16 items-center justify-center min-h-[70vh] flex-col gap-6 px-4 sm:px-6">
        <div className="text-center max-w-xl">
          <span className="mb-3 inline-flex rounded-full bg-[#0E6B58]/10 px-4 py-2 text-xs font-black text-[#0E6B58]">
            {locale === 'ar' ? 'المحفظة الإلكترونية' : 'Digital Wallet'}
          </span>
          <h2 className="font-black text-3xl sm:text-4xl text-[#101820] mt-2">{t('title')}</h2>
          <p className="text-[#5E6D68] mt-3 text-sm sm:text-base leading-relaxed">
            {t('description')}
          </p>
        </div>

        <div className="w-full max-w-xl bg-white border border-[#E7E1D6] rounded-[36px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(16,24,32,0.05)]">
          {hasBankAccount ? (
            <AccountBalance
              balance={balance}
              bank={bank}
              operations={operations}
              token={token}
            />
          ) : (
            <div className="flex flex-col items-center gap-6 justify-center w-full py-6">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-[#0E6B58]/10 to-[#C89B3C]/10 flex items-center justify-center border border-[#0E6B58]/20">
                <Image src={wallet} alt="wallet" className="w-16 h-16 object-contain" />
              </div>
              <div className="text-center w-full">
                <h2 className="font-black text-[#101820] text-lg sm:text-xl">{t('noBankTitle')}</h2>
                <p className="mt-2 text-[#5E6D68] text-sm max-w-xs mx-auto leading-relaxed">
                  {t('noBankDescription')}
                </p>
                <AddBankButton token={token} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default page;
