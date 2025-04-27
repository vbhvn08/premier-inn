'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Locale, locales } from '../../../i18n-config';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;

    // Get the path without the locale prefix
    const segments = pathname.split('/');
    const isLocaleSegment = locales.includes(segments[1] as Locale);
    const pathWithoutLocale = isLocaleSegment
      ? '/' + segments.slice(2).join('/')
      : pathname;

    // Always include the locale in the path for consistency
    // Use the same structure for all locales including 'en'
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    router.push(newPath);
  };

  return (
    <div className='relative inline-block'>
      <select
        value={locale}
        onChange={handleLanguageChange}
        className='appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 pr-8 text-purple-900 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:outline-none'
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        <option value='en' className='px-2 py-1'>
          English
        </option>
        <option value='de' className='px-2 py-1'>
          Deutsch
        </option>
      </select>
    </div>
  );
}
