'use client'

import {
  ChangeEvent,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  KeyboardEvent,
} from 'react'
import { Combobox, Transition } from '@headlessui/react'
import unidecode from 'unidecode'
import { debounce } from 'lodash'
import { MapPin } from 'lucide-react'

interface CityProps {
  id: string
  ibge_code: number
  name: string
  cover_url: string | null
}

interface SearchFormProps {
  cities: CityProps[]
  placeholder?: string
  onSelectCity: (city: CityProps) => void
}

interface SearchFormRef {
  setSelectedCity: (city: CityProps | null) => void
}

export const SearchForm = forwardRef<SearchFormRef, SearchFormProps>(
  function SearchForm(
    { cities, placeholder, onSelectCity }: SearchFormProps,
    ref,
  ) {
    const [selectedCity, setSelectedCity] = useState<CityProps | null>(null)
    const [query, setQuery] = useState('')

    // eslint-disable-next-line
  let filteredCities: CityProps[] = []

    if (query !== '') {
      filteredCities = cities.filter((city) => {
        const cityFiltered = {
          ...city,
          nameFormatted: unidecode(city.name.toLowerCase()),
        }

        return cityFiltered.nameFormatted
          .toLowerCase()
          .includes(unidecode(query.toLowerCase()))
      })
    }

    async function changeHandler(event: ChangeEvent<HTMLInputElement>) {
      setQuery(event.target.value)
    }

    const debounceChangeHandler = useMemo(() => {
      return debounce(changeHandler, 300)
    }, [])

    async function handleSelectCity(city: CityProps) {
      setSelectedCity(city)
      onSelectCity(city)
    }

    async function handleEscapeKey(event: KeyboardEvent<HTMLInputElement>) {
      if (event.key === 'Escape') {
        setSelectedCity(null)
      }
    }

    useImperativeHandle(ref, () => ({
      setSelectedCity: (city: CityProps | null) => setSelectedCity(city),
    }))

    return (
      <Combobox value={selectedCity} onChange={handleSelectCity}>
        <div className="relative flex flex-col items-center justify-center rounded-lg bg-gray-50 shadow-xl">
          <label className="flex h-full w-full items-center gap-2 p-2">
            <MapPin size={16} className="text-gray-600" />
            <Combobox.Input
              placeholder={placeholder}
              onChange={debounceChangeHandler}
              onKeyDown={handleEscapeKey}
              displayValue={(city: CityProps) => city?.name}
              className="h-full w-full rounded-md bg-transparent py-2 text-sm outline-none"
            />
          </label>

          {filteredCities.length > 0 && (
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
              className={
                'absolute top-16 w-full rounded-md bg-white p-2 shadow-lg'
              }
            >
              <Combobox.Options>
                <ul className="w-full space-y-2 hover:cursor-pointer">
                  {filteredCities.map((city) => (
                    <Combobox.Option
                      key={city.id}
                      value={city}
                      className={'text-sm'}
                    >
                      {city.name}
                    </Combobox.Option>
                  ))}
                </ul>
              </Combobox.Options>
            </Transition>
          )}
        </div>
      </Combobox>
    )
  },
)
