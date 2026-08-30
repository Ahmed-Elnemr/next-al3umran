import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface FieldErrorProps {
  message?: string;
  className?: string;
}

const FieldError: React.FC<FieldErrorProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`mt-2 flex items-start gap-2 bg-red-50 text-red-600 px-3 py-2.5 rounded-lg border border-red-100 shadow-sm animate-fade-in ${className}`}>
      <FiAlertCircle className="w-[18px] h-[18px] mt-0.5 shrink-0" />
      <span className="text-sm font-medium leading-tight">{message}</span>
    </div>
  );
};

export default FieldError;
