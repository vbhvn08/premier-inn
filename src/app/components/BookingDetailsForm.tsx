'use client';

import React, { useEffect, useState } from 'react';
import { useForm, Controller, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookingDetailsFormProps } from '../types';
import {
  bookingDetailsSchema,
  BookingDetails,
} from '../schemas/bookingFormSchema';
import { useTranslations } from 'next-intl';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Define Hotel type if not available from HotelDataProvider
export interface Hotel {
  code: string;
  title: string;
  brand: string;
}

export default function BookingDetailsForm({
  data,
  onChange,
  onContinue,
}: BookingDetailsFormProps) {
  const t = useTranslations('booking.bookingDetails');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hotelQuery, setHotelQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Date range state for the date picker
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    data.checkIn ? new Date(data.checkIn) : null,
    data.checkOut ? new Date(data.checkOut) : null,
  ]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BookingDetails>({
    resolver: zodResolver(bookingDetailsSchema) as Resolver<BookingDetails>,
    defaultValues: { ...data },
    mode: 'onChange',
  });

  // Watch for form changes and update parent component
  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as BookingDetails);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const onSubmit = (data: BookingDetails) => {
    onChange(data);
    if (onContinue) {
      onContinue();
    }
  };

  // Fetch hotels based on search query
  useEffect(() => {
    const fetchHotels = async () => {
      if (hotelQuery.length < 1) {
        setHotels([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/hotels?query=${encodeURIComponent(hotelQuery)}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch hotels');
        }

        const data = await response.json();
        setHotels(data.hotels || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setHotels([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchHotels();
    }, 300); // Debounce to avoid too many requests

    return () => clearTimeout(timer);
  }, [hotelQuery]);

  const handleHotelSelect = (hotel: Hotel) => {
    setValue('hotel', hotel.title);
    setShowSuggestions(false);
  };

  // Handle date range change
  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDateRange([start, end]);

    // Format and update form values
    if (start) {
      // Format the dates as YYYY-MM-DD
      const formattedStartDate = start.toISOString().split('T')[0];
      setValue('checkIn', formattedStartDate);
    } else {
      setValue('checkIn', '');
    }

    if (end) {
      const formattedEndDate = end.toISOString().split('T')[0];
      setValue('checkOut', formattedEndDate);
    } else {
      setValue('checkOut', '');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='form-section'>
        <div className='form-group'>
          <h3 className='form-section-title'>{t('bookerTypeTitle')}</h3>
          <div className='radio-group'>
            <label
              className={`radio-option ${watch('bookerType') === 'personal' ? 'bordered' : ''}`}
            >
              <Controller
                name='bookerType'
                control={control}
                render={({ field }) => (
                  <input
                    type='radio'
                    id='booker-personal'
                    value='personal'
                    checked={field.value === 'personal'}
                    onChange={() => field.onChange('personal')}
                  />
                )}
              />
              <span>{t('bookerTypeOptions.personal')}</span>
            </label>

            <label
              className={`radio-option ${watch('bookerType') === 'business' ? 'bordered' : ''}`}
            >
              <Controller
                name='bookerType'
                control={control}
                render={({ field }) => (
                  <input
                    type='radio'
                    id='booker-business'
                    value='business'
                    checked={field.value === 'business'}
                    onChange={() => field.onChange('business')}
                  />
                )}
              />
              <span>{t('bookerTypeOptions.business')}</span>
            </label>

            <label
              className={`radio-option ${watch('bookerType') === 'travelManagementCompany' ? 'bordered' : ''}`}
            >
              <Controller
                name='bookerType'
                control={control}
                render={({ field }) => (
                  <input
                    type='radio'
                    id='booker-travelManagement'
                    value='travelManagementCompany'
                    checked={field.value === 'travelManagementCompany'}
                    onChange={() => field.onChange('travelManagementCompany')}
                  />
                )}
              />
              <span>{t('bookerTypeOptions.travelManagement')}</span>
            </label>

            <label
              className={`radio-option ${watch('bookerType') === 'travelAgentTourOperator' ? 'bordered' : ''}`}
            >
              <Controller
                name='bookerType'
                control={control}
                render={({ field }) => (
                  <input
                    type='radio'
                    id='booker-travelAgent'
                    value='travelAgentTourOperator'
                    checked={field.value === 'travelAgentTourOperator'}
                    onChange={() => field.onChange('travelAgentTourOperator')}
                  />
                )}
              />
              <span>{t('bookerTypeOptions.travelAgent')}</span>
            </label>
          </div>
          {errors.bookerType && (
            <span className='error-message'>{errors.bookerType.message}</span>
          )}
        </div>

        <div className='form-group'>
          <h3 className='form-section-title'>{t('stayingForTitle')}</h3>
          <div className='radio-group'>
            <label
              className={`radio-option ${watch('stayingFor') === 'business' ? 'bordered' : ''}`}
            >
              <Controller
                name='stayingFor'
                control={control}
                render={({ field }) => (
                  <input
                    type='radio'
                    id='staying-business'
                    value='business'
                    checked={field.value === 'business'}
                    onChange={() => field.onChange('business')}
                  />
                )}
              />
              <span>{t('stayingForOptions.business')}</span>
            </label>

            <label
              className={`radio-option ${watch('stayingFor') === 'leisure' ? 'bordered' : ''}`}
            >
              <Controller
                name='stayingFor'
                control={control}
                render={({ field }) => (
                  <input
                    type='radio'
                    id='staying-leisure'
                    value='leisure'
                    checked={field.value === 'leisure'}
                    onChange={() => field.onChange('leisure')}
                  />
                )}
              />
              <span>{t('stayingForOptions.leisure')}</span>
            </label>
          </div>
          {errors.stayingFor && (
            <span className='error-message'>{errors.stayingFor.message}</span>
          )}
        </div>

        <div className='form-group'>
          <div className='checkbox-group'>
            <Controller
              name='isSchoolOrYouthGroup'
              control={control}
              render={({ field }) => (
                <input
                  type='checkbox'
                  id='schoolGroup'
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <label htmlFor='schoolGroup'>{t('schoolGroupLabel')}</label>
          </div>
        </div>

        <div className='form-group'>
          <h3 className='form-section-title'>{t('reasonVisitTitle')}</h3>
          <select
            id='reasonForVisit'
            {...register('reasonForVisit')}
            className={`${errors.reasonForVisit ? 'error' : ''}`}
          >
            <option value=''>{t('reasonOptions.placeholder')}</option>
            <option value='leisure'>{t('reasonOptions.leisure')}</option>
            <option value='business'>{t('reasonOptions.business')}</option>
            <option value='wedding'>{t('reasonOptions.wedding')}</option>
            <option value='event'>{t('reasonOptions.event')}</option>
            <option value='other'>{t('reasonOptions.other')}</option>
          </select>
          {errors.reasonForVisit && (
            <span className='error-message'>
              {errors.reasonForVisit.message}
            </span>
          )}
        </div>

        <div className='form-group'>
          <h3 className='form-section-title'>{t('hotelDetailsTitle')}</h3>
          <p className='form-description'>{t('hotelDetailsDescription')}</p>

          <div className='input-with-icon'>
            <div className='input-icon'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
                <circle cx='12' cy='10' r='3'></circle>
              </svg>
            </div>
            <Controller
              name='hotel'
              control={control}
              render={({ field }) => (
                <input
                  type='text'
                  id='hotel'
                  placeholder={t('hotelPlaceholder')}
                  className={`${errors.hotel ? 'error' : ''}`}
                  autoComplete='off'
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setHotelQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => {
                    if (field.value && field.value.length >= 3) {
                      setHotelQuery(field.value);
                      setShowSuggestions(true);
                    }
                  }}
                />
              )}
            />
            {showSuggestions && hotelQuery.length >= 1 && (
              <div
                className='absolute top-12 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg focus:outline-none'
                role='listbox'
              >
                {isLoading ? (
                  <div className='px-4 py-2 text-sm text-gray-500'>
                    Loading...
                  </div>
                ) : hotels.length === 0 ? (
                  <div className='px-4 py-2 text-sm text-gray-500'>
                    No hotels found
                  </div>
                ) : (
                  hotels.map((hotel) => (
                    <div
                      key={hotel.code}
                      className='cursor-pointer px-4 py-2 text-sm hover:bg-blue-100'
                      role='option'
                      aria-selected={watch('hotel') === hotel.title}
                      onClick={() => handleHotelSelect(hotel)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleHotelSelect(hotel);
                        }
                      }}
                      tabIndex={0}
                    >
                      <span className='font-medium'>{hotel.title}</span>
                      <span className='ml-1 text-gray-500'>({hotel.code})</span>
                    </div>
                  ))
                )}
              </div>
            )}
            {errors.hotel && (
              <span className='error-message'>{errors.hotel.message}</span>
            )}
          </div>
        </div>

        <div className='form-group'>
          <div className='input-with-icon'>
            <div className='input-icon'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
                <line x1='16' y1='2' x2='16' y2='6'></line>
                <line x1='8' y1='2' x2='8' y2='6'></line>
                <line x1='3' y1='10' x2='21' y2='10'></line>
              </svg>
            </div>
            <DatePicker
              id='dateRange'
              selected={dateRange[0]}
              onChange={handleDateRangeChange}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              selectsRange
              minDate={new Date()} // Prevent selecting dates in the past
              className={`${errors.checkIn || errors.checkOut ? 'error' : ''}`}
              placeholderText={
                t('dateRangePlaceholder') ||
                'Select check-in and check-out dates'
              }
              dateFormat='yyyy-MM-dd'
              autoComplete='off'
              monthsShown={2}
            />
          </div>

          {(errors.checkIn || errors.checkOut) && (
            <span className='error-message'>
              {errors.checkIn?.message || errors.checkOut?.message}
            </span>
          )}

          <input type='hidden' {...register('checkIn')} />
          <input type='hidden' {...register('checkOut')} />
        </div>
      </div>

      <div className='mt-6'>
        <button type='submit' className='btn primary'>
          {t('continue') || 'Continue'}
        </button>
      </div>
    </form>
  );
}
