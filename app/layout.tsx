import { Inter, Literata, Readex_Pro, Sora } from 'next/font/google'
import Providers from './providers'

import './globals.css'
import Nav from '@/app/nav';
import Footer from './footer';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], display: "swap", variable: "--font-inter" });
const sora = Sora({ subsets: ['latin'], display: "swap", variable: "--font-sora" });
const readexPro = Readex_Pro({ subsets: ['latin'], display: "swap", variable: "--font-readex" });
const literata = Literata({ subsets: ['latin'], display: "swap", variable: "--font-literata" });

export const metadata: Metadata = {
  title: 'tygr.dev',
  description: 'a professional idiot.',
  keywords: ["tygerxqt", "ty mason", "tygr dev", "tygr", "tyger796", "tyger"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${readexPro.variable} ${literata.variable}`}>
      <body className='flex flex-col gap-2 items-center w-full bg-neutral-100 dark:bg-neutral-900'>
        <div className='max-w-[800px] w-full p-2 sm:p-4'>
          <Providers>
            <Nav />
            {children}
            <Footer />
          </Providers >
        </div>
      </body>
    </html>
  )
}
