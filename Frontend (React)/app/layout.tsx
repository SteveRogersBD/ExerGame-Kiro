import type { Metadata } from 'next'
import { Fredoka, Inter } from 'next/font/google'
import './globals.css'

const fredoka = Fredoka({ 
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'WiggleWorld - Learn, Play, Wiggle!',
  description: 'The fun way for kids to stay active while learning. Interactive exergame with gesture-based play.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="bg-background text-white font-inter">
        {children}
      </body>
    </html>
  )
}

