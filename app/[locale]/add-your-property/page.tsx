import React from 'react'
import SellYourService from './SellYourServiceForm'
import { cookies } from "next/headers";

import { redirect } from 'next/navigation';

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("client_type")?.value;

  if (!token) {
    redirect(`/${locale}/login`);
  }

  if (role !== "company") {
    redirect(`/${locale}`);
  }

  return (
    <div>
        <SellYourService token = {token}/>
    </div>
  )
}

export default page