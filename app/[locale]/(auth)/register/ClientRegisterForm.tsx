'use client';
import React, { useEffect } from 'react';
import { useLocale } from 'next-intl';
import RegisterForm from './RegisterForm';

const ClientRegisterForm = () => {
  const locale = useLocale();

  useEffect(() => {
    if (typeof document !== "undefined" && document.cookie.includes("token=")) {
      window.location.href = `/${locale}`;
    }
  }, [locale]);

  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default ClientRegisterForm;
