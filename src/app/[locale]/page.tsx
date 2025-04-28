import GroupBookingForm from '../components/BookingForm';
import Header from '../components/Header';
import { getTranslations } from 'next-intl/server';

// Metadata for the page
export const metadata = {
  title: 'Premier Inn Group Booking',
  description: 'Book accommodations for groups at Premier Inn hotels',
};

// Generate static params at build time for most common locales
export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }];
}

export default async function Home() {
  // Use server-side translations
  const t = await getTranslations('booking');

  return (
    <main>
      <Header />
      <div className='page-container'>
        <div className='mx-auto my-10 max-w-xl px-4 md:px-6'>
          <div className='mb-8'>
            <h1 className='mb-3 text-2xl font-bold text-[#5a2b82]'>
              {t('pageTitle')}
            </h1>
            <p className='text-gray-600'>{t('description')}</p>
          </div>
          <GroupBookingForm />
        </div>
        <div className='mt-8'>
          <button
            type='button'
            className='rounded-md px-6 py-3 text-gray-700 transition-colors hover:bg-gray-300'
          >
            {t('cancelAndReturnHome')}
          </button>
        </div>
      </div>
    </main>
  );
}
