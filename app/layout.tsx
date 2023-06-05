import { Inter, Literata, Readex_Pro, Sora } from 'next/font/google'
import Providers from './providers'

import './globals.css'
import Nav from '@/components/nav';

const inter = Inter({ subsets: ['latin'], display: "swap", variable: "--font-inter" });
const sora = Sora({ subsets: ['latin'], display: "swap", variable: "--font-sora" });
const readexPro = Readex_Pro({ subsets: ['latin'], display: "swap", variable: "--font-readex" });
const literata = Literata({ subsets: ['latin'], display: "swap", variable: "--font-literata" });

export const metadata = {
  title: 'tygr.dev',
  description: 'a professional idiot.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${readexPro.variable} ${literata.variable}`}>
      <body className='flex flex-col items-center w-full gap-2 '>
        <div className='max-w-[800px] w-full p-4'>
          <Providers>
            <Nav />
            {children}
          </Providers >
        </div>
      </body>
    </html>
  )
}
