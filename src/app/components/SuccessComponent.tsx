import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Header from './Header';

interface SuccessComponentProps {
  referenceNumber?: string;
  email?: string;
  firstName?: string;
}

export default function SuccessComponent({
  referenceNumber = 'CAS-613801-F0N9Y4',
  email,
  firstName,
}: SuccessComponentProps) {
  const t = useTranslations('booking.success');

  return (
    <main>
      <Header />
      <div className='flex min-h-[calc(100vh-100px)] flex-col items-center justify-center px-4 py-8'>
        <div className='w-full max-w-xl'>
          <h1 className='mb-6 text-center text-2xl font-bold'>{`${t('title')} ${firstName}`}</h1>

          <p className='mb-6 text-center'>
            {t('caseNumber')} {referenceNumber}
          </p>

          {email && (
            <p className='mb-6 text-center'>
              {t('emailSent')} {email}
            </p>
          )}

          <p className='mb-12 text-center'>{t('responseTime')}</p>

          <div className='flex justify-center'>
            <Link
              href='/'
              className='rounded-md bg-[#59294F] px-8 py-3 font-medium text-white transition-colors hover:bg-[#4a2042]'
            >
              {t('backToHomepage')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
