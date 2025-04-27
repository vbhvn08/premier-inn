import { redirect } from 'next/navigation';
import { defaultLocale } from '../../i18n-config';

// This page handles redirects from the root to the localized routes
export default function RootPage() {
  // When users visit the root, redirect them to the default locale
  redirect(`/${defaultLocale}`);
}
