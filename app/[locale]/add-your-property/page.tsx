import React, { Suspense } from 'react'
import AddPropertyForm from './AddPropertyForm'
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
      <Suspense fallback={<div className="p-10 text-center">Loading form...</div>}>
        <AddPropertyForm token={token} />
      </Suspense>
    </div>
  )
}

export default page