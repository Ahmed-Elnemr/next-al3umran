import Container from '@/components/shared/container';
import React from 'react';
import NotificationsData from './NotificationsData';
import { cookies } from 'next/headers';

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <Container className="my-20">
      <NotificationsData token={token} />
    </Container>
  );
};

export default page;
