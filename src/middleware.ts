import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest } from 'next/server';

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Main middleware that combines i18n and adds cache headers
export default async function middleware(request: NextRequest) {
  // Skip internationalization for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    return;
  }

  // Get the response from the i18n middleware
  const response = await intlMiddleware(request);

  // Add cache control headers for static assets
  if (
    request.nextUrl.pathname.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|json)$/)
  ) {
    // Cache static assets for 30 days (public, max-age=2592000)
    response.headers.set(
      'Cache-Control',
      'public, max-age=2592000, stale-while-revalidate=86400',
    );
  } else if (
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.endsWith('/page')
  ) {
    // For main pages - use ISR cache strategy
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=60',
    );
  } else {
    // Default for other routes
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30',
    );
  }

  return response;
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … if they end with a file extension like .jpg
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
