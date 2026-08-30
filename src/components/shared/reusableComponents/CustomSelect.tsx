'use client';
import * as React from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import FieldError from "./FieldError";

type SelectTypes = {
  value: string;
  label: string;
};

interface CustomSelectProps {
  name: string;
  control: any;
  placeholder?: string;
  label?: string;
  options: SelectTypes[];
  className?: string;
  icon?: React.ReactNode;
  defaultValue?: string; // 
  error?: string;
  rules?: any;
  disabled?: boolean;
}

export default function CustomSelect({
  name,
  control,
  placeholder,
  label,
  options,
  className,
  icon,
  defaultValue, // 
  error,
  rules,
  disabled,
}: CustomSelectProps) {
  return (
    <div className={`w-full lg:mb-4 mb-0 ${className ?? ""}`}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue} // لضمان التهيئة داخل RHF
        render={({ field }) => (
          <>
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

              <Select disabled={disabled} onValueChange={field.onChange} value={field.value || undefined}>
                <SelectTrigger
                  className={`
                    btn-select bg-[#f5f5f5] outline-none w-full md:h-[64px] h-[50px]  ${icon ? 'pr-12' : 'pr-5' }  pl-4 border rounded-xl
                    outline-none transition placeholder:text-[#989898]  text-xs md:text-lg
                    text-right relative
                  `}
                >
                  <SelectValue placeholder={placeholder ?? "اختر..."} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    {options?.filter((option) => option.value).map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <FieldError message={error} />
          </>
        )}
      />
    </div>
  );
}
