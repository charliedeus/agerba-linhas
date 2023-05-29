'use client'

import { useRef } from 'react'
import { useBusRoutesStore } from './BusRoutes'

interface CityProps {
  id: string
  ibge_code: number
  name: string
  cover_url: string | null
}

interface BusRouteProps {
  id: string
  bus_route_number: string
  name: string
  operator?: string
  operator_id?: string
  count_permit_holders?: number
  is_active: boolean
  starts_in_id: string
  ends_in_id: string
  starts_in: CityProps
  ends_in: CityProps
}

interface InitialStoreProps {
  busRoutes: BusRouteProps[]
}

export default function InitializerBusRoutesStore({
  busRoutes = [],
}: InitialStoreProps) {
  const initializer = useRef(false)

  if (!initializer.current) {
    useBusRoutesStore.getState()
    initializer.current = true
  }

  return null
}
