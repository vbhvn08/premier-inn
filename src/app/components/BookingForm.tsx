import { useState, useEffect } from 'react';
import { useForm, FormProvider, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ContactDetailsForm from './ContactDetailsForm';
import BookingDetailsForm from './BookingDetailsForm';
import RoomRequirementsForm from './RoomRequirementsForm';
import CollapsibleSection from './CollapsibleSection';
import { bookingFormSchema } from '../schemas/bookingFormSchema';
import type { BookingForm } from '../schemas/bookingFormSchema';
import { FormSectionKey } from '../types';
import { useTranslations } from 'next-intl';

export default function GroupBookingForm() {
  const t = useTranslations('booking');
  // Initialize form with react-hook-form
  const methods = useForm<BookingForm>({
    resolver: zodResolver(bookingFormSchema) as Resolver<BookingForm>,
    mode: 'onChange',
  });

  // Local state for form data
  const [formData, setFormData] = useState<Partial<BookingForm>>();

  // Add state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | undefined>(
    undefined,
  );
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  // Track which section is open
  const [openSections, setOpenSections] = useState({
    contactDetails: true,
    bookingDetails: false,
    roomRequirements: false,
  });

  // Toggle between form sections
  const toggleSection = (section: FormSectionKey) => {
    setOpenSections({
      contactDetails: section === 'contactDetails',
      bookingDetails: section === 'bookingDetails',
      roomRequirements: section === 'roomRequirements',
    });
  };

  // Handle form section changes
  const handleChange = (
    section: FormSectionKey,
    data: Partial<BookingForm[keyof BookingForm]>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));

    // Clear server errors when user makes changes
    if (Object.keys(serverErrors).length > 0) {
      setServerErrors({});
    }
  };

  // Navigate to next section after validation
  const handleContinue = (currentSection: FormSectionKey) => {
    console.log('formData: ', formData);
    if (currentSection === 'contactDetails') {
      toggleSection('bookingDetails');
    } else if (currentSection === 'bookingDetails') {
      toggleSection('roomRequirements');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setServerErrors({});

    // Validate the entire form before submission
    const isValid = await methods.trigger();
    if (!isValid) {
      // Get all the errors from the form
      const errors = methods.formState.errors;
      console.log('Form validation errors:', errors);
      // Open the section containing errors
      if (errors.contactDetails) {
        toggleSection('contactDetails');
      } else if (errors.bookingDetails) {
        toggleSection('bookingDetails');
      } else if (errors.roomRequirements) {
        toggleSection('roomRequirements');
      }

      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setServerErrors(result.errors);

          // Open the section with errors
          for (const key in result.errors) {
            if (key.startsWith('contactDetails')) {
              toggleSection('contactDetails');
              break;
            } else if (key.startsWith('bookingDetails')) {
              toggleSection('bookingDetails');
              break;
            } else if (key.startsWith('roomRequirements')) {
              toggleSection('roomRequirements');
              break;
            }
          }
        } else {
          setSubmissionError(
            result.message || 'Failed to submit form. Please try again.',
          );
        }
        return;
      }

      // Handle successful submission
      window.alert('Booking submitted successfully!');
      methods.reset();
      setFormData({});
      // Reset form sections
      setOpenSections({
        contactDetails: true,
        bookingDetails: false,
        roomRequirements: false,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Synchronize between local state and react-hook-form state
  useEffect(() => {
    methods.reset(
      {
        ...methods.getValues(),
        ...formData,
      },
      { keepErrors: true, keepDirty: true },
    );
  }, [formData, methods]);

  // Set server-side errors in the form
  useEffect(() => {
    if (Object.keys(serverErrors).length > 0) {
      for (const [path, message] of Object.entries(serverErrors)) {
        methods.setError(path as keyof BookingForm, {
          type: 'server',
          message,
        });
      }
    }
  }, [serverErrors, methods]);

  return (
    <FormProvider {...methods}>
      <div className='space-y-5'>
        <CollapsibleSection
          title={t('contactDetailsTitle')}
          isOpen={openSections.contactDetails}
          onToggle={() => toggleSection('contactDetails')}
        >
          <ContactDetailsForm
            data={methods.getValues().contactDetails || {}}
            onChange={(data) => handleChange('contactDetails', data)}
            onContinue={() => handleContinue('contactDetails')}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title={t('bookingDetailsTitle')}
          isOpen={openSections.bookingDetails}
          onToggle={() => toggleSection('bookingDetails')}
        >
          <BookingDetailsForm
            data={methods.getValues().bookingDetails || {}}
            onChange={(data) => handleChange('bookingDetails', data)}
            onContinue={() => handleContinue('bookingDetails')}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title={t('roomRequirementsTitle')}
          isOpen={openSections.roomRequirements}
          onToggle={() => toggleSection('roomRequirements')}
        >
          <RoomRequirementsForm
            data={methods.getValues().roomRequirements || {}}
            onChange={(data) => handleChange('roomRequirements', data)}
            onSubmit={() => handleSubmit()}
            isSubmitting={isSubmitting}
            submissionError={submissionError}
          />
        </CollapsibleSection>
      </div>
    </FormProvider>
  );
}
