import React from 'react';
import Container from '@/components/shared/container';
import apiServiceCall from '@/lib/apiServiceCall';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import WalletClientView from './WalletClientView';

export const dynamic = 'force-dynamic';

const WalletPage = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const role = cookieStore.get('client_type')?.value;

  if (token && role !== 'company') {
    redirect(`/${locale}`);
  }

  const t = await getTranslations('wallet');

  let balance = 0;
  let bank = null;
  let operations: any[] = [];

  if (token) {
    try {
      const walletResponse = await apiServiceCall({
        url: 'client/wallet',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept-Language': locale,
          'X-Locale': locale,
        },
      });

      if (walletResponse?.data) {
        balance = walletResponse.data.balance || 0;
        bank = walletResponse.data.bank || null;
        operations = walletResponse.data.operations || [];
      }
    } catch (error) {
      console.warn('Failed to fetch wallet data from client/wallet:', error);
    }
  }

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} className="py-12 lg:py-20 bg-[#F6F4EE] min-h-screen">
      <Container>
        <div className="space-y-8 px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-black text-3xl sm:text-4xl text-[#101820]">{t('title')}</h1>
            <p className="text-[#5E6D68] mt-3 text-sm sm:text-base leading-relaxed">
              {t('description')}
            </p>
          </div>

          <WalletClientView
            balance={balance}
            bank={bank}
            operations={operations}
            token={token}
          />
        </div>
      </Container>
    </div>
  );
};

export default WalletPage;
