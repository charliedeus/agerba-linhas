import { create } from 'zustand'

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
  operator: string
  operator_id: string
  count_permit_holders: number
  is_active: boolean
  starts_in_id: string
  ends_in_id: string
  starts_in: CityProps
  ends_in: CityProps
  itinerary: {
    place_itinerary: [
      {
        section_number: number
        is_access: boolean
        place: {
          name: string
        }
      },
    ]
  }[]
  timetable: {
    id: string
    direction: string
    weekday: string
    starts_at: string
    bus_route_id: string
  }[]
}

interface StoreProps {
  searchedBusRoutes: BusRouteProps[]
  getSearchedBusRoutes: (busRoutes: BusRouteProps[]) => void
  clearSearchedBusRoutes: () => void
}

export const useBusRoutesStore = create<StoreProps>((set) => ({
  searchedBusRoutes: [],

  getSearchedBusRoutes: (newSearchedBusRoutes) => {
    set((state) => ({
      searchedBusRoutes: [...newSearchedBusRoutes],
    }))
  },
  clearSearchedBusRoutes: () => {
    set({ searchedBusRoutes: [] })
  },
}))
