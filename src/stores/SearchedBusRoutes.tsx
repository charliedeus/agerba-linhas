import { create } from 'zustand'

interface CityProps {
  id: string
  ibge_code: number
  name: string
  cover_url: string | null
}

interface LineProps {
  id: string
  bus_route_number: string
  name: string
  is_active: boolean
  starts_in_id: string
  ends_in_id: string
  starts_in: CityProps
  ends_in: CityProps
}

interface ActionProps {
  getBusRoutes: (busRotues: LineProps[] | [LineProps]) => void
}

interface useSearchedBusRoutesStoreProps {
  state: {
    searchedBusRoutes: LineProps[]
  }
  actions: ActionProps
}

export const useSearchedBusRoutesStore = create<useSearchedBusRoutesStoreProps>(
  (set) => ({
    state: {
      searchedBusRoutes: [],
    },
    actions: {
      getBusRoutes: (busRoutes) =>
        set((state) => ({
          state: {
            searchedBusRoutes: [
              ...state.state.searchedBusRoutes,
              ...(Array.isArray(busRoutes) ? busRoutes : [busRoutes]),
            ],
          },
        })),
    },
  }),
)
