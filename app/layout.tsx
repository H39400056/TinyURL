import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from '@/components/UserProvider';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'shortURL',
  description: 'Shorten your URLs for free',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <Navigation />
          <main className="container mx-auto py-16">
            {children}
          </main>
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
