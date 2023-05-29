'use client'

import { forwardRef, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SearchForm } from './SearchForm'
import { useForm } from 'react-hook-form'
import { Search, X } from 'lucide-react'
import { useBusRoutesStore } from '@/stores/BusRoutes'

interface CityProps {
  id: string
  ibge_code: number
  name: string
  cover_url: string | null
}

interface NewSearchBusRouteFormProps {
  cities: CityProps[]
  // action: any
}

const newSearchFormValidationSchema = z.object({
  originCityId: z.string().nullable(),
  destinyCityId: z.string().nullable(),
})

type NewSearchFormValidationData = z.infer<typeof newSearchFormValidationSchema>

export const NewSearchBusRouteForm = forwardRef<
  HTMLFormElement,
  NewSearchBusRouteFormProps
>(function NewSearchBusRouteForm({ cities }: NewSearchBusRouteFormProps, ref) {
  const setSearchedBusRoutes = useBusRoutesStore(
    (state) => state.getSearchedBusRoutes,
  )

  const { register, handleSubmit, setValue, reset } =
    useForm<NewSearchFormValidationData>({
      resolver: zodResolver(newSearchFormValidationSchema),
      defaultValues: {
        originCityId: null,
        destinyCityId: null,
      },
    })

  const formRef = useRef<HTMLFormElement>(null)

  async function handleSearchCities(data: NewSearchFormValidationData) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/linhas/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originCityId: data.originCityId,
          destinyCityId: data.destinyCityId,
        }),
      },
    )

    const { busRoutes } = await response.json()
    // action(busRoutes)
    setSearchedBusRoutes(busRoutes)

    return busRoutes
  }

  async function handleSelectOriginCity(city: CityProps) {
    setValue('originCityId', city.id)
  }

  async function handleSelectDestinyCity(city: CityProps) {
    setValue('destinyCityId', city.id)
  }

  async function handleClearForm() {
    reset()
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit(handleSearchCities)}
        className="flex flex-1 flex-col items-center gap-2 desktop:flex-row desktop:gap-4"
        autoComplete="off"
        // action={action}
      >
        <div className="flex w-full flex-col items-center gap-2 laptop:flex-row">
          <label className="z-40 w-full flex-1">
            <SearchForm
              cities={cities}
              placeholder="Origem"
              onSelectCity={handleSelectOriginCity}
              {...register('originCityId')}
            />
          </label>
          <label className="z-30 w-full flex-1">
            <SearchForm
              cities={cities}
              placeholder="Destino"
              onSelectCity={handleSelectDestinyCity}
              {...register('destinyCityId')}
            />
          </label>
        </div>

        <div className="flex h-full w-full items-center gap-2 desktop:max-w-sm">
          <button
            type="submit"
            className="flex h-full flex-1 items-center justify-center gap-2 rounded-md bg-green-600 p-2 text-white"
          >
            <Search size={16} />
            <span>Buscar</span>
          </button>
          <button
            type="reset"
            onClick={handleClearForm}
            className="flex h-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white"
          >
            <X size={16} />
          </button>
        </div>
      </form>
    </>
  )
})
