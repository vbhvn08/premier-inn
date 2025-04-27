'use client';

import React, { useEffect } from 'react';
import {
  useForm,
  SubmitHandler,
  useFormContext,
  Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RoomRequirementsFormProps } from '../types';
import {
  roomRequirementsSchema,
  RoomRequirements,
} from '../schemas/bookingFormSchema';
import { useTranslations } from 'next-intl';

export default function RoomRequirementsForm({
  data,
  onChange,
  onSubmit,
  isSubmitting,
  submissionError,
}: RoomRequirementsFormProps) {
  const t = useTranslations('booking.roomRequirements');
  // Access parent form context when part of the complete form
  const parentForm = useFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RoomRequirements>({
    resolver: zodResolver(roomRequirementsSchema) as Resolver<RoomRequirements>,
    defaultValues: {
      singleOccupancyRooms: data.singleOccupancyRooms || 0,
      doubleOccupancyRooms: data.doubleOccupancyRooms || 0,
      twinRooms: data.twinRooms || 0,
      hasChildrenStaying: data.hasChildrenStaying || false,
      needsAccessibleRoom: data.needsAccessibleRoom || false,
      additionalInformation: data.additionalInformation || '',
    },
    mode: 'onChange',
  });

  // Watch for form changes and update parent component
  useEffect(() => {
    const subscription = watch((value) => {
      const formData = value as RoomRequirements;
      onChange(formData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const onSubmitBookingForm: SubmitHandler<RoomRequirements> = (formData) => {
    onChange(formData);
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitBookingForm)} className='space-y-6'>
      <div className='form-section'>
        <h3 className='form-section-title'>{t('title')}</h3>
        <p className='mb-6 leading-normal text-gray-600'>
          {t('roomsDescription')}
        </p>

        {/* Additional Options */}
        <div className='mb-5'>
          <div className='mb-3 flex items-center gap-2'>
            <input
              type='checkbox'
              id='hasChildrenStaying'
              {...register('hasChildrenStaying')}
              className='h-[18px] w-[18px]'
            />
            <label htmlFor='hasChildrenStaying'>{t('childrenStaying')}</label>
          </div>

          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='needsAccessibleRoom'
              {...register('needsAccessibleRoom')}
              className='h-[18px] w-[18px]'
            />
            <label htmlFor='needsAccessibleRoom'>{t('accessibleNeeded')}</label>
          </div>
        </div>

        <div className='mb-6 flex flex-col gap-6'>
          {/* Single Occupancy Rooms */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-xl font-medium text-gray-800'>
                  {t('singleOccupancy')}
                </h4>
                <p className='text-gray-600'>1 adult</p>
              </div>
              <div className='flex items-center'>
                <button
                  type='button'
                  className='flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-600 hover:bg-gray-50'
                  onClick={() => {
                    const currentValue = watch('singleOccupancyRooms');
                    if (currentValue > 0) {
                      setValue('singleOccupancyRooms', currentValue - 1);
                    }
                  }}
                >
                  −
                </button>
                <input
                  id='singleOccupancyRooms'
                  type='number'
                  min='0'
                  {...register('singleOccupancyRooms', { valueAsNumber: true })}
                  className='h-14 w-20 [appearance:textfield] border-none text-center text-xl font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
                <button
                  type='button'
                  className='flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-teal-600 hover:bg-gray-50'
                  onClick={() => {
                    const currentValue = watch('singleOccupancyRooms');
                    setValue('singleOccupancyRooms', currentValue + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            {errors.singleOccupancyRooms && (
              <span className='mt-1 block text-sm text-red-600'>
                {errors.singleOccupancyRooms?.message}
              </span>
            )}
          </div>

          {/* Double Occupancy Rooms */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-xl font-medium text-gray-800'>
                  {t('doubleOccupancy')}
                </h4>
                <p className='text-gray-600'>2 adults</p>
              </div>
              <div className='flex items-center'>
                <button
                  type='button'
                  className='flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-600 hover:bg-gray-50'
                  onClick={() => {
                    const currentValue = watch('doubleOccupancyRooms');
                    if (currentValue > 0) {
                      setValue('doubleOccupancyRooms', currentValue - 1);
                    }
                  }}
                >
                  −
                </button>
                <input
                  id='doubleOccupancyRooms'
                  type='number'
                  min='0'
                  {...register('doubleOccupancyRooms', { valueAsNumber: true })}
                  className='h-14 w-20 [appearance:textfield] border-none text-center text-xl font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
                <button
                  type='button'
                  className='flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-teal-600 hover:bg-gray-50'
                  onClick={() => {
                    const currentValue = watch('doubleOccupancyRooms');
                    setValue('doubleOccupancyRooms', currentValue + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            {errors.doubleOccupancyRooms && (
              <span className='mt-1 block text-sm text-red-600'>
                {errors.doubleOccupancyRooms?.message}
              </span>
            )}
          </div>

          {/* Twin Rooms */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-xl font-medium text-gray-800'>
                  {t('twin')}
                </h4>
                <p className='text-gray-600'>2 adults</p>
              </div>
              <div className='flex items-center'>
                <button
                  type='button'
                  className='flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-600 hover:bg-gray-50'
                  onClick={() => {
                    const currentValue = watch('twinRooms');
                    if (currentValue > 0) {
                      setValue('twinRooms', currentValue - 1);
                    }
                  }}
                >
                  −
                </button>
                <input
                  id='twinRooms'
                  type='number'
                  min='0'
                  {...register('twinRooms', { valueAsNumber: true })}
                  className='h-14 w-20 [appearance:textfield] border-none text-center text-xl font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
                <button
                  type='button'
                  className='flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-teal-600 hover:bg-gray-50'
                  onClick={() => {
                    const currentValue = watch('twinRooms');
                    setValue('twinRooms', currentValue + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>
            {errors.twinRooms && (
              <span className='mt-1 block text-sm text-red-600'>
                {errors.twinRooms?.message}
              </span>
            )}
          </div>
        </div>

        {/* Common validation error for total rooms */}
        {parentForm?.formState.errors?.roomRequirements && (
          <div className='mt-2 text-red-600'>
            {parentForm.formState.errors.roomRequirements.message as string}
          </div>
        )}

        <div className='mt-6 flex justify-between border-t border-gray-200 py-4'>
          <span className='text-xl font-medium'>Total:</span>
          <span className='text-xl font-medium'>
            {(watch('singleOccupancyRooms') || 0) +
              (watch('doubleOccupancyRooms') || 0) +
              (watch('twinRooms') || 0)}{' '}
            rooms
          </span>
        </div>

        <div className='mt-6 mb-6'>
          <label
            className='mb-2 block font-medium text-gray-700'
            htmlFor='additionalInformation'
          >
            {t('additionalInfo')}
          </label>
          <textarea
            id='additionalInformation'
            {...register('additionalInformation')}
            className='font-inherit w-full resize-y rounded border border-gray-300 p-3 text-base focus:border-red-600 focus:ring-2 focus:ring-red-100 focus:outline-none'
            placeholder={t('comments')}
            rows={4}
          />
          {errors.additionalInformation && (
            <span className='mt-1 block text-sm text-red-600'>
              {errors.additionalInformation?.message}
            </span>
          )}
        </div>
      </div>
      {submissionError && (
        <div className='mb-4 text-red-600'>{submissionError}</div>
      )}

      {/* Submit Button */}
      <div className='mt-6'>
        <button type='submit' className='btn primary' disabled={isSubmitting}>
          {t('submitRequest')}
        </button>
      </div>
    </form>
  );
}
