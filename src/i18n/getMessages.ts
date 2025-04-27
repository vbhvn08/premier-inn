import type { Locale } from '../../i18n-config';

// This function loads messages for a specific locale
export default async function getMessages(locale: Locale) {
  return (await import(`../../messages/${locale}/index.json`)).default;
}
