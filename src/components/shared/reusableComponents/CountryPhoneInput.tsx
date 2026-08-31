'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';

interface Country {
  code: string;
  label: string;
  prefix: string;
  flag: string;
}

interface CountryPhoneInputProps {
  register: UseFormRegister<any>;
  name: string;
  placeholder?: string;
  countries: Country[];
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  locale: string;
}

const CountryPhoneInput: React.FC<CountryPhoneInputProps> = ({
  register,
  name,
  placeholder,
  countries,
  selectedCountry,
  onCountryChange,
  locale,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAr = locale === 'ar';

  // Handle clicking outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mb-4" ref={dropdownRef}>
      <div 
        className={`flex items-center bg-[#f5f5f5] w-full md:h-[64px] h-[55px] border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#0E6B58] focus-within:bg-white transition-all duration-300 ${
          isAr ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-4 h-full bg-[#eaeaea] hover:bg-[#dfdfdf] text-gray-800 font-bold transition-all duration-200 shrink-0 ${
            isAr ? 'border-l border-gray-200' : 'border-r border-gray-200'
          }`}
          dir="ltr"
        >
          <span className="text-xl">{selectedCountry.flag}</span>
          <span className="text-sm font-mono">{selectedCountry.prefix}</span>
          <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Phone Input Field */}
        <input
          {...register(name)}
          type="tel"
          placeholder={placeholder}
          className={`w-full h-full bg-transparent px-4 border-none outline-none font-bold text-gray-800 text-base placeholder:text-gray-400 placeholder:font-normal ${
            isAr ? 'text-right' : 'text-left'
          }`}
          dir="ltr" // Keeps numbers flowing left-to-right correctly while cursor behaves nicely based on parent alignment
        />
      </div>

      {/* Custom Dropdown List */}
      {isOpen && (
        <div 
          className="absolute top-[105%] w-[220px] bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200 left-0"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <p className="text-[10px] font-black text-gray-400 px-3 py-1 uppercase tracking-wider">
            {isAr ? 'اختر الدولة' : 'Select Country'}
          </p>
          <div className="flex flex-col gap-1 mt-1">
            {countries.map((c, idx) => {
              const isSelected = selectedCountry.id && c.id 
                ? String(selectedCountry.id) === String(c.id) 
                : selectedCountry.code === c.code;
              return (
                <button
                  key={c.id || c.code || idx}
                  type="button"
                  onClick={() => {
                    onCountryChange(c);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 ${
                    isSelected 
                      ? 'bg-[#EEF6F3] text-[#0E6B58]' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{c.flag}</span>
                    <span>{c.label.split(' ')[0]}</span>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{c.prefix}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryPhoneInput;
