import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/themes/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { bioData } from '@/features/bio/data/links-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://concas2025.github.io'),
  applicationName: 'AD — Personal Space',
  title: `${bioData.name} | Thông Tin Liên Hệ & Bio Links`,
  description: bioData.bio,
  openGraph: {
    title: `${bioData.name} | Bio Link Hub`,
    description: bioData.bio,
    images: [{ url: bioData.avatarUrl, width: 400, height: 400, alt: bioData.name }]
  }
};

export const viewport: Viewport = {
  themeColor: '#09090b'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='vi' suppressHydrationWarning>
      <body className='min-h-screen bg-background font-sans antialiased selection:bg-primary selection:text-primary-foreground'>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
