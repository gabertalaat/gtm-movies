import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://gtm-movies.vercel.app'),
  title: {
    default: 'GTM MOVIES | gtm movies - مشاهدة افلام اون لاين HD',
    template: '%s | GTM MOVIES'
  },
  description: 'موقع GTM MOVIES الرسمي - شاهد أحدث الأفلام العربية والأجنبية مترجمة اون لاين بجودة عالية HD و 4K. ابحث عن gtm movies أو جي تي ام موفيز.',
  keywords: [
    'GTM MOVIES', 'GTM movies', 'gtm movies', 'gtm Movies', 'Gtm Movies',
    'جي تي ام موفيز', 'جي تي ام', 'موقع جي تي ام',
    'افلام', 'مشاهدة افلام', 'افلام اون لاين', 'افلام عربي', 
    'افلام اجنبي', 'افلام مترجمة', 'افلام جديدة 2026'
  ],
  authors: [{ name: 'GTM MOVIES' }],
  creator: 'GTM MOVIES',
  publisher: 'GTM MOVIES',
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: 'https://gtm-movies.vercel.app',
    siteName: 'GTM MOVIES',
    title: 'GTM MOVIES - الموقع الرسمي لمشاهدة الافلام',
    description: 'ابحث عن gtm movies وشاهد أحدث الأفلام مترجمة اون لاين',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'GTM MOVIES' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTM MOVIES - مشاهدة افلام اون لاين',
    description: 'الموقع الرسمي gtm movies',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://gtm-movies.vercel.app',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="google-site-verification" content="cE1A8JUQedszuKdgFawApx_OfCJlOR_k4-7scBSdCrg" />
      </head>
      <body className={cairo.className}>{children}</body>
    </html>
  );
}
