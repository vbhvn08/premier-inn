import { Suspense } from 'react';
import SuccessComponent from '../../components/SuccessComponent';

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
}) {
  const { ref, email, firstName } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessComponent
        referenceNumber={ref}
        email={email}
        firstName={firstName}
      />
    </Suspense>
  );
}
