'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactDetailsFormProps } from '../types';
import {
  ContactDetails,
  contactDetailsSchema,
} from '../schemas/bookingFormSchema';
import { useTranslations } from 'next-intl';

export default function ContactDetailsForm({
  data,
  onChange,
  onContinue,
}: ContactDetailsFormProps) {
  const t = useTranslations('booking.contactDetails');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ContactDetails>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: { ...data },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as ContactDetails);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const onSubmit = (data: ContactDetails) => {
    console.log('Form submitted:', data);
    onChange(data);
    if (onContinue) {
      onContinue();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='form-section'>
        <h3 className='form-section-title'>{t('title')}</h3>

        <div className='form-group'>
          <select id='title' {...register('title')}>
            <option value=''>{t('titlePlaceholder')}</option>
            <option value='mr'>{t('titleOptions.mr')}</option>
            <option value='mrs'>{t('titleOptions.mrs')}</option>
            <option value='ms'>{t('titleOptions.ms')}</option>
            <option value='dr'>{t('titleOptions.dr')}</option>
          </select>
          {errors.title && (
            <span className='error-message'>{errors.title.message}</span>
          )}
        </div>

        <div className='form-group'>
          <input
            type='text'
            id='firstName'
            placeholder={t('firstNamePlaceholder')}
            {...register('firstName')}
            className={`${errors.firstName ? 'error' : ''}`}
          />
          {errors.firstName && (
            <span className='error-message'>{errors.firstName.message}</span>
          )}
        </div>

        <div className='form-group'>
          <input
            type='text'
            id='lastName'
            placeholder={t('lastNamePlaceholder')}
            {...register('lastName')}
            className={`${errors.lastName ? 'error' : ''}`}
          />
          {errors.lastName && (
            <span className='error-message'>{errors.lastName.message}</span>
          )}
        </div>

        <div className='form-group'>
          <div className='phone-input'>
            <span className='country-code'>+44</span>
            <input
              type='tel'
              id='phone'
              placeholder={t('phonePlaceholder')}
              {...register('phone')}
              className={`${errors.phone ? 'error' : ''}`}
            />
          </div>
          {errors.phone && (
            <span className='error-message'>{errors.phone.message}</span>
          )}
        </div>

        <div className='form-group'>
          <input
            type='email'
            id='email'
            placeholder={t('emailPlaceholder')}
            {...register('email')}
            className={`${errors.email ? 'error' : ''}`}
          />
          {errors.email && (
            <span className='error-message'>{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className='mt-6'>
        <button type='submit' className='btn primary'>
          {t('continue')}
        </button>
      </div>
    </form>
  );
}
