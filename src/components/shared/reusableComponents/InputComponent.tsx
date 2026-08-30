'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import FieldError from './FieldError';

interface InputComponentProps {
  register: UseFormRegister<any>;
  name: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  className?: string;
  label?: string;
  rules?: any;
}

const InputComponent: React.FC<InputComponentProps> = ({
  register,
  name,
  type = 'text',
  error,
  placeholder,
  icon,
  className = '',
  label,
  rules,
}) => {
  return (
    <div className={`w-full mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-bold text-[#101820] mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-gray-400">
            {icon}
          </div>
        )}
        <input
          {...register(name, rules)}
          type={type}
          placeholder={placeholder}
          className={`bg-[#f5f5f5] w-full md:h-[64px] h-[50px] ${icon ? 'pr-12' : 'pr-5'} pl-4 border rounded-xl outline-none  transition placeholder:text-[#989898]`}
        />
      </div>

      <FieldError message={error} />
    </div>
  );
};

export default InputComponent;
