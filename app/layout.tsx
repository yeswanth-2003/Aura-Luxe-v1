
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import GiftConciergeWrapper from '@/components/GiftConciergeWrapper';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Aura Luxe | Fine Jewellery',
  description: 'A high-end jewellery e-commerce platform inspired by GIVA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Tailwind CDN to enable utility classes in dev without a full Tailwind build */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-[#FDFBF7] text-[#1a1a1a] min-h-screen flex flex-col">
        <HeaderWrapper />
        <main className="flex-grow">{children}</main>
        <Footer />
        <GiftConciergeWrapper />
      </body>
    </html>
  );
}
