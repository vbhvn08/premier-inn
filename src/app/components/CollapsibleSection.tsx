import React from 'react';
import { CollapsibleSectionProps } from '../types';

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className='m-0 overflow-hidden border border-gray-200'>
      <div
        className={`flex cursor-pointer items-center justify-between p-5 transition-colors ${isOpen ? 'border-b border-gray-200 bg-white' : 'bg-gray-50 hover:bg-gray-100'}`}
        onClick={onToggle}
        role='button'
        aria-expanded={isOpen}
        tabIndex={0}
      >
        <h2 className='m-0 text-xl font-medium text-[#5a2b82]'>{title}</h2>
        <div className='flex h-6 w-6 items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`h-5 w-5 transform text-[#5a2b82] transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </div>
      {isOpen && <div className='bg-white p-6'>{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
