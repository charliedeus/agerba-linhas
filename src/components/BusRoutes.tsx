'use client'

import { useState } from 'react'
import { useBusRoutesStore } from '@/stores/BusRoutes'
import { X } from 'lucide-react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'

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

export function BusRoutes() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedBusRoute, setSelectedBusRoute] = useState<BusRouteProps>()
  const { searchedBusRoutes, clearSearchedBusRoutes } = useBusRoutesStore()

  async function handleSelectedBusRoute(busRoute: BusRouteProps) {
    setModalIsOpen(true)
    setSelectedBusRoute(busRoute)
  }

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
                <div className="flex max-h-80 w-full flex-1 overflow-hidden rounded-md shadow-md">
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
                <Dialog.Title>
                  <h1 className="font-semibold">Detalhes da Linha</h1>
                </Dialog.Title>
                <Dialog.Description className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <h3 className="font-medium">Número: </h3>
                    <p>{selectedBusRoute?.bus_route_number}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <h3 className="font-medium">Descrição:</h3>
                    <p>{selectedBusRoute?.name.toUpperCase()}</p>
                  </div>

                  {!!selectedBusRoute?.operator && (
                    <div className="flex items-center gap-4">
                      <h3 className="font-medium">Operador:</h3>
                      <p>{selectedBusRoute?.operator.toUpperCase()}</p>
                    </div>
                  )}
                </Dialog.Description>

                <p>
                  Are you sure you want to deactivate your account? All of your
                  data will be permanently removed. This action cannot be
                  undone.
                </p>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  )
}
