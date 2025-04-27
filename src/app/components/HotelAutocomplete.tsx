'use client';

import React, { useEffect, useState } from 'react';
import { Hotel } from './BookingDetailsForm';

interface HotelAutocompleteProps {
  id: string;
  labelId: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (hotel: Hotel) => void;
  placeholder: string;
  error?: string;
}

const HotelAutocomplete: React.FC<HotelAutocompleteProps> = ({
  id,
  labelId,
  value,
  onChange,
  onSelect,
  placeholder,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(value || '');
  const [suggestions, setSuggestions] = useState<Hotel[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch hotels when the search query changes
  useEffect(() => {
    const fetchHotels = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/hotels?search=${encodeURIComponent(searchQuery)}`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }

        const data = await response.json();
        setSuggestions(data.hotels || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchHotels();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onChange(value);
    setIsOpen(true);
  };

  const handleSelectHotel = (hotel: Hotel) => {
    setSearchQuery(hotel.title);
    onChange(hotel.title);
    onSelect(hotel);
    setIsOpen(false);
  };

  const handleFocus = () => {
    if (searchQuery.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    // Delay closing to allow click event on suggestions
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className='relative'>
      <div className='relative'>
        <input
          type='text'
          id={id}
          aria-labelledby={labelId}
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`block w-full rounded-md shadow-sm sm:text-sm ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        {isLoading && (
          <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-t-blue-500'></div>
          </div>
        )}
      </div>

      {error && (
        <p className='mt-1 text-sm text-red-600' role='alert'>
          {error}
        </p>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm'>
          {suggestions.map((hotel) => (
            <li
              key={hotel.code}
              className='cursor-pointer px-3 py-2 text-sm hover:bg-blue-100'
              onClick={() => handleSelectHotel(hotel)}
            >
              {hotel.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HotelAutocomplete;
