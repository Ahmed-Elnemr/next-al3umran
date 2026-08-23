import Container from '@/components/shared/container';
import React from 'react';
import notification from '@/public/images/notification.png';
import Image from 'next/image';
import NotificationsData from './NotificationsData';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { getNotifications } from '../../../src/lib/serverActions';

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

const mapNotification = (item: any) => ({
  id: item.id,
  data: {
    title: item.title || item.data?.title || '',
    message: item.body || item.data?.body || item.data?.message || '',
    type: item.type || item.data?.type || '',
    model_id: item.data?.notification_group_id || item.data?.model_id,
  },
  is_read: Boolean(item.is_read ?? item.read_at),
  created_at: item.created_at,
});

const page = async ({ params }: LayoutProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notifications' });

  const response = token ? await getNotifications(locale) : { data: [] };
  const payload = response?.data;
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.notifications?.data)
        ? payload.notifications.data
        : [];
  const notifications = rows.map(mapNotification);

  return (
    <Container className="my-20">
      <div className="text-center mb-10">
        <h2 className="text-primary font-extrabold text-2xl mb-2">{t('title')}</h2>
        <p className="text-gray-600">{t('description')}</p>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-10">
          <Image
            src={notification}
            alt="notification"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h4 className="text-lg font-bold mb-2">{t('emptyTitle')}</h4>
          <p className="text-gray-500">{t('emptyDescription')}</p>
        </div>
      ) : (
        <NotificationsData data={notifications} token={token} />
      )}
    </Container>
  );
};

export default page;
