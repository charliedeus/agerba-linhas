'use client'

import { useBusRoutesStore } from '@/stores/BusRoutes'
import { MostAttendedCities } from './MostAttendedCities'
import { BusRoutes } from './BusRoutes'

interface CityProps {
  id: string
  ibge_code: number
  name: string
  cover_url: string | null
  attendeds: number
}

interface MainListsProps {
  cities: CityProps[]
}

export default function MainLists({ cities }: MainListsProps) {
  const { searchedBusRoutes } = useBusRoutesStore()

  return (
    <main className="py-2">
      {searchedBusRoutes.length > 0 ? (
        <BusRoutes />
      ) : (
        <MostAttendedCities cities={cities} />
      )}
    </main>
  )
}
