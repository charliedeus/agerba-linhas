import { ReactNode } from 'react'

import './globals.css'

import { Poppins } from 'next/font/google'
import { Header } from '@/components/Header'

const poppins = Poppins({
  display: 'swap',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Linhas | AGERBA',
  description:
    'App construído para acesso a dados de linhas reguladas pela Agência',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} flex max-h-screen min-h-screen flex-col bg-white font-sans`}
      >
        <Header />
        <main className="mx-auto flex h-full w-full max-w-[1280px] flex-1 flex-col px-2 py-2 laptop:px-0">
          {children}
        </main>
      </body>
    </html>
  )
}
