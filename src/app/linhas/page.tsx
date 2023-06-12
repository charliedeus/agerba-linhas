import Image from 'next/image'

import bgImg from '../../assets/background-image.jpg'
import logoWhite from '../../assets/logo-white.png'

import { NewSearchBusRouteForm } from '@/components/NewSearchBusRouteForm'
import MainLists from '@/components/MainLists'

export default async function BusRoutes() {
  const { orderedResultMostAttendedCities, allCities } = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/info`,
    {
      cache: 'force-cache',
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    },
  ).then((response) => response.json())

  return (
    <div className="flex max-h-screen flex-1 flex-col gap-6 p-2">
      <div className={`relative flex h-80 max-h-80 bg-transparent`}>
        <Image
          src={bgImg}
          alt=""
          className="flex rounded-t-2xl object-cover object-center"
        />

        <div className="absolute flex h-full w-full flex-col justify-between space-y-6 rounded-t-2xl bg-gradient-to-b from-blue-900 px-4 pt-16">
          <Image src={logoWhite} alt="" width={100} height={80} />

          <h1 className="text-lg text-white">
            Que linhas deseja
            <span className="block font-bold">consultar?</span>
          </h1>

          <div className="z-50 flex w-full flex-col gap-4 laptop:flex-row desktop:pb-4">
            <NewSearchBusRouteForm
              cities={allCities}
              // action={handleSearchResult}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 rounded-b-lg p-2">
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-2">
            <MainLists cities={orderedResultMostAttendedCities} />
          </div>
        </div>
      </div>
    </div>
  )
}
