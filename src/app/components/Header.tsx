import React from 'react';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  return (
    <header className='border-b-4 border-[#5a2b82] bg-white px-6 py-5'>
      <div className='container mx-auto flex items-center justify-between'>
        <div className='flex items-center'>
          <Image
            src='/premier-inn-logo.svg'
            alt='Premier Inn'
            width={180}
            height={50}
            className='logo'
            priority
            unoptimized
          />
        </div>
        <div className='flex items-center'>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
