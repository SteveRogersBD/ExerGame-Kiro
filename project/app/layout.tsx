import './globals.css';
import '../styles/accessibility.css';
import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';

const fredoka = Fredoka({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fredoka'
});

export const metadata: Metadata = {
  title: 'WiggleWorld - Learn, Play, Wiggle!',
  description: 'A fun, active adventure where kids move to learn',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} font-fredoka antialiased`}>{children}</body>
    </html>
  );
}