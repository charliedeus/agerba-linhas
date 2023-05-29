import Link from 'next/link'
import Image from 'next/image'

import logoImg from '../assets/agerba-completo.svg'
import { IntegratorBar } from './IntegratorBar'
import { Navbar } from './Navbar'

export function Header() {
  return (
    <header className="relative hidden h-full w-full flex-col px-0 laptop:block">
      <div className="h-2 w-full bg-gradient-to-r from-[#EF3037] to-[#3F3F95] pt-0" />
      <div className="relative m-auto flex h-[7.25rem] w-full max-w-[1280px] items-center justify-between px-[14px]">
        <Link href="/">
          <Image src={logoImg} width={100} alt="" />
        </Link>
      </div>

      <IntegratorBar />

      <Navbar />
    </header>
  )
}
