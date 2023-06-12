'use client'

import { useEffect, useState } from 'react'
import { useBusRoutesStore } from '@/stores/BusRoutes'
import { X, ChevronsRight, ChevronsLeft } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'
import { useKeenSlider } from 'keen-slider/react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import 'keen-slider/keen-slider.min.css'

dayjs.locale('pt-br')

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

interface TimesTableProps {
  id: string
  direction: string
  weekday: string
  starts_at: string
  bus_route_id: string
}
interface TimesTableState {
  ida: TimesTableProps[]
  volta: TimesTableProps[]
}

export function BusRoutes() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedBusRoute, setSelectedBusRoute] = useState<BusRouteProps>()
  const { searchedBusRoutes, clearSearchedBusRoutes } = useBusRoutesStore()
  const [timesTable, setTimesTable] = useState<TimesTableState>()

  // eslint-disable-next-line no-undef
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
  })

  async function handleSelectedBusRoute(busRoute: BusRouteProps) {
    setModalIsOpen(true)
    setSelectedBusRoute(busRoute)
  }

  function orderedByTimesTable(schedules: TimesTableProps[]): {
    ida: TimesTableProps[]
    volta: TimesTableProps[]
  } {
    const groupTimesTable: {
      ida: TimesTableProps[]
      volta: TimesTableProps[]
    } = {
      ida: [],
      volta: [],
    }

    for (const schedule of schedules) {
      if (schedule.direction === 'IDA') {
        groupTimesTable.ida.push(schedule)
      } else if (schedule.direction === 'VOLTA') {
        groupTimesTable.volta.push(schedule)
      }
    }

    // Ordenando os horários de ida
    groupTimesTable.ida.sort((a, b) => {
      const timeA = new Date(a.starts_at).getTime()
      const timeB = new Date(b.starts_at).getTime()

      return timeA - timeB
    })

    groupTimesTable.volta.sort((a, b) => {
      const timeA = new Date(a.starts_at).getTime()
      const timeB = new Date(b.starts_at).getTime()

      return timeA - timeB
    })

    return groupTimesTable
  }

  useEffect(() => {
    if (selectedBusRoute?.timetable) {
      const unorderedTimesTable = orderedByTimesTable(
        selectedBusRoute?.timetable,
      )
      setTimesTable(unorderedTimesTable)
    }
  }, [selectedBusRoute])

  return (
    <main className="flex flex-1 flex-col gap-4">
      <header className="flex items-center justify-between">
        <h1 className="font-semibold">Linhas encontradas</h1>
        <button onClick={clearSearchedBusRoutes}>
          <X />
        </button>
      </header>

      <ul className="flex flex-col gap-2 rounded-md text-xs">
        {searchedBusRoutes.map((item) => (
          <li
            className="flex flex-1 gap-1 rounded-sm bg-zinc-100 p-1 hover:cursor-pointer"
            key={item.id}
            onClick={() => handleSelectedBusRoute(item)}
          >
            <div className="flex min-w-[4.5rem] justify-between">
              <p>{item.bus_route_number}</p>
              <span>{' - '}</span>
            </div>
            <div>
              {item.starts_in.name} {' x '} {item.ends_in.name}
            </div>
          </li>
        ))}
      </ul>

      <Transition
        show={true}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        // as={Fragment}
      >
        <Dialog
          open={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0">
            <div className="fixed inset-0 flex items-center justify-center p-4 laptop:m-auto laptop:px-96 laptop:py-16">
              <Dialog.Panel className="flex h-full w-full flex-1 flex-col gap-4 rounded bg-white p-4">
                <div className="flex max-h-60 w-full flex-1 overflow-hidden rounded-md shadow-md">
                  <Image
                    src={
                      selectedBusRoute?.ends_in.cover_url ||
                      'https://images.unsplash.com/photo-1622522867204-35b68cb3d200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
                    }
                    width={390}
                    height={585}
                    alt=""
                    className="flex-1 object-cover object-center blur-sm"
                  />
                </div>
                <Dialog.Title className="flex items-center justify-between">
                  <h1 className="font-semibold">Detalhes da Linha</h1>
                  <X onClick={() => setModalIsOpen(false)} />
                </Dialog.Title>
                <Dialog.Description className="flex flex-col gap-2 text-sm">
                  <>
                    <div className="flex items-center gap-4">
                      <h1 className="self-start font-bold">Número: </h1>
                      <p className="rounded-md bg-red-600 px-2 py-1 font-bold text-gray-50">
                        {selectedBusRoute?.bus_route_number}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h1 className="font-medium">Descrição:</h1>
                      <p className="text-xs">
                        {selectedBusRoute?.name.toUpperCase()}
                      </p>
                    </div>

                    {!!selectedBusRoute?.operator && (
                      <div className="flex flex-col gap-1">
                        <h1 className="font-medium">Operador:</h1>
                        <p className="text-xs">
                          {selectedBusRoute?.operator.toUpperCase()}
                        </p>
                      </div>
                    )}

                    {!!selectedBusRoute?.itinerary[0].place_itinerary && (
                      <div className="hidden tablet:flex tablet:flex-col tablet:gap-1">
                        <h1 className="font-medium">Itinerário:</h1>
                        <p className="text-xs">
                          {selectedBusRoute?.itinerary[0].place_itinerary
                            .map((item) => item.place.name)
                            .join(', ')
                            .replace(/,(?=[^,]*$)/, ' e')}
                        </p>
                      </div>
                    )}

                    <div className="laptop:hidden">
                      {!!timesTable && (
                        <div
                          className="keen-slider hidden w-full py-4"
                          ref={sliderRef}
                        >
                          <div className="keen-slider__slide w-full">
                            <div className="flex w-full items-center gap-2 py-2">
                              <h1 className="flex flex-1 items-center justify-center font-bold">
                                IDA
                              </h1>
                              <p className="flex animate-bounce items-center gap-2 text-[9px] laptop:hidden">
                                <ChevronsRight size={14} /> Arraste
                              </p>
                            </div>
                            <table className="w-full table-fixed border-spacing-1 text-sm">
                              <thead>
                                <tr className="">
                                  <th className="rounded-sm bg-zinc-500">
                                    SEG
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    TER
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    QUA
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    QUI
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    SEX
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    SÁB
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    DOM
                                  </th>
                                </tr>
                              </thead>

                              <div className="h-2" />

                              <tbody>
                                <tr>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.ida.map((item) => {
                                      if (item.weekday === 'SEG') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.ida.map((item) => {
                                      if (item.weekday === 'TER') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.ida.map((item) => {
                                      if (item.weekday === 'QUA') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.ida.map((item) => {
                                      if (item.weekday === 'QUI') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.ida.map((item) => {
                                      if (item.weekday === 'SEX') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.ida.map((item) => {
                                      if (item.weekday === 'SAB') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.ida.map((item) => {
                                      if (item.weekday === 'DOM') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="keen-slider__slide w-full">
                            <div className="flex w-full items-center gap-2 py-2">
                              <p className="flex animate-bounce items-center gap-2 text-[9px] laptop:hidden">
                                Arraste <ChevronsLeft size={14} />
                              </p>
                              <h1 className="flex flex-1 items-center justify-center font-bold">
                                VOLTA
                              </h1>
                              <p className="flex animate-bounce items-center gap-2 text-[9px] laptop:hidden">
                                Arraste <ChevronsRight size={14} />
                              </p>
                            </div>
                            <table className="w-full table-fixed border-spacing-1 text-sm">
                              <thead>
                                <tr>
                                  <th className="rounded-sm bg-zinc-500">
                                    SEG
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    TER
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    QUA
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    QUI
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    SEX
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    SÁB
                                  </th>
                                  <th className="rounded-sm bg-zinc-500">
                                    DOM
                                  </th>
                                </tr>
                              </thead>

                              <div className="h-2" />

                              <tbody>
                                <tr>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.volta.map((item) => {
                                      if (item.weekday === 'SEG') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.volta.map((item) => {
                                      if (item.weekday === 'TER') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.volta.map((item) => {
                                      if (item.weekday === 'QUA') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.volta.map((item) => {
                                      if (item.weekday === 'QUI') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.volta.map((item) => {
                                      if (item.weekday === 'SEX') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.volta.map((item) => {
                                      if (item.weekday === 'SAB') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                  <td className="mx-auto box-border h-full align-top text-xs">
                                    {timesTable.volta.map((item) => {
                                      if (item.weekday === 'DOM') {
                                        const formattedTime = dayjs(
                                          item.starts_at,
                                        ).format('HH:mm')
                                        return (
                                          <span
                                            className="flex flex-1 items-center justify-center"
                                            key={item.id}
                                          >
                                            {formattedTime}
                                          </span>
                                        )
                                      } else {
                                        return null // Adicionando um retorno padrão quando a condição não é atendida
                                      }
                                    })}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="keen-slider__slide w-full">
                            {!!selectedBusRoute?.itinerary[0]
                              .place_itinerary && (
                              <div className="flex flex-col gap-1">
                                <div className="flex w-full items-center gap-2 py-2">
                                  <p className="flex animate-bounce items-center gap-2 text-[9px]">
                                    Arraste <ChevronsLeft size={14} />
                                  </p>
                                  <h1 className="flex flex-1 items-center justify-center font-bold">
                                    ITINERÁRIO
                                  </h1>
                                </div>
                                <p className="text-xs">
                                  {selectedBusRoute?.itinerary[0].place_itinerary
                                    .map((item) => item.place.name)
                                    .join(', ')
                                    .replace(/,(?=[^,]*$)/, ' e')}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {!!timesTable && (
                      <div className="hidden py-4 laptop:flex laptop:items-center laptop:gap-2">
                        <div className="flex-1">
                          <div className="flex w-full items-center gap-2 py-2">
                            <h1 className="flex flex-1 items-center justify-center font-bold">
                              IDA
                            </h1>
                            <p className="flex animate-bounce items-center gap-2 text-[9px] laptop:hidden">
                              <ChevronsRight size={14} /> Arraste
                            </p>
                          </div>
                          <table className="w-full table-fixed border-spacing-1 text-sm">
                            <thead>
                              <tr className="">
                                <th className="rounded-sm bg-zinc-500">SEG</th>
                                <th className="rounded-sm bg-zinc-500">TER</th>
                                <th className="rounded-sm bg-zinc-500">QUA</th>
                                <th className="rounded-sm bg-zinc-500">QUI</th>
                                <th className="rounded-sm bg-zinc-500">SEX</th>
                                <th className="rounded-sm bg-zinc-500">SÁB</th>
                                <th className="rounded-sm bg-zinc-500">DOM</th>
                              </tr>
                            </thead>

                            <div className="h-2" />

                            <tbody>
                              <tr>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.ida.map((item) => {
                                    if (item.weekday === 'SEG') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.ida.map((item) => {
                                    if (item.weekday === 'TER') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.ida.map((item) => {
                                    if (item.weekday === 'QUA') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.ida.map((item) => {
                                    if (item.weekday === 'QUI') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.ida.map((item) => {
                                    if (item.weekday === 'SEX') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.ida.map((item) => {
                                    if (item.weekday === 'SAB') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.ida.map((item) => {
                                    if (item.weekday === 'DOM') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="flex-1">
                          <div className="flex w-full items-center gap-2 py-2">
                            <p className="flex animate-bounce items-center gap-2 text-[9px] laptop:hidden">
                              Arraste <ChevronsLeft size={14} />
                            </p>
                            <h1 className="flex flex-1 items-center justify-center font-bold">
                              VOLTA
                            </h1>
                            <p className="flex animate-bounce items-center gap-2 text-[9px] laptop:hidden">
                              Arraste <ChevronsRight size={14} />
                            </p>
                          </div>
                          <table className="w-full table-fixed border-spacing-1 text-sm">
                            <thead>
                              <tr>
                                <th className="rounded-sm bg-zinc-500">SEG</th>
                                <th className="rounded-sm bg-zinc-500">TER</th>
                                <th className="rounded-sm bg-zinc-500">QUA</th>
                                <th className="rounded-sm bg-zinc-500">QUI</th>
                                <th className="rounded-sm bg-zinc-500">SEX</th>
                                <th className="rounded-sm bg-zinc-500">SÁB</th>
                                <th className="rounded-sm bg-zinc-500">DOM</th>
                              </tr>
                            </thead>

                            <div className="h-2" />

                            <tbody>
                              <tr>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.volta.map((item) => {
                                    if (item.weekday === 'SEG') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.volta.map((item) => {
                                    if (item.weekday === 'TER') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.volta.map((item) => {
                                    if (item.weekday === 'QUA') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.volta.map((item) => {
                                    if (item.weekday === 'QUI') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.volta.map((item) => {
                                    if (item.weekday === 'SEX') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.volta.map((item) => {
                                    if (item.weekday === 'SAB') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                                <td className="mx-auto box-border h-full align-top text-xs">
                                  {timesTable.volta.map((item) => {
                                    if (item.weekday === 'DOM') {
                                      const formattedTime = dayjs(
                                        item.starts_at,
                                      ).format('HH:mm')
                                      return (
                                        <span
                                          className="flex flex-1 items-center justify-center"
                                          key={item.id}
                                        >
                                          {formattedTime}
                                        </span>
                                      )
                                    } else {
                                      return null // Adicionando um retorno padrão quando a condição não é atendida
                                    }
                                  })}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                </Dialog.Description>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  )
}
