import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SettingsProvider } from '@/lib/settings-context';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';
import { SiteShell } from '@/components/site-shell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Z & Z International — Fashion World Wide',
  description: 'Premium essentials, considered globally. Designed for every destination.',
  icons: { icon: '/unnamed.jpg', apple: '/unnamed.jpg' },
  openGraph: {
    title: 'Z & Z International — Fashion World Wide',
    description: 'Premium essentials, considered globally. Designed for every destination.',
    images: [{ url: '/unnamed.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/unnamed.jpg' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/unnamed.jpg" />
        <link rel="apple-touch-icon" href="/unnamed.jpg" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <SettingsProvider>
              <CartProvider>
                <SiteShell>{children}</SiteShell>
                <Toaster position="top-center" richColors />
              </CartProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
