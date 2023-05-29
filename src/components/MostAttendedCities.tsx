'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import { useKeenSlider } from 'keen-slider/react'

import 'keen-slider/keen-slider.min.css'
import Link from 'next/link'

interface MostAttendedCitiesProps {
  cities?: {
    id: string
    name: string
    coverUrl?: string
    attendeds: number
  }[]
}

export function MostAttendedCities({ cities }: MostAttendedCitiesProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 2.25,
      spacing: 6,
    },
    breakpoints: {
      '(min-width: 640px)': {
        slides: {
          perView: 7.25,
          spacing: 6,
        },
      },
    },
  })

  return (
    <div className="flex flex-col gap-2 text-sm" ref={sliderRef}>
      <h1 className="font-semibold">Cidades</h1>
      <div className="keen-slider flex items-center">
        {cities?.map((item) => (
          <Link
            href={'/'}
            key={item.id}
            className="keen-slider__slide relative flex h-44 max-h-44 w-full min-w-[137.33px] flex-1 flex-col justify-end rounded-lg shadow-lg"
          >
            <Suspense>
              <Image
                src={
                  item.coverUrl ||
                  'https://images.unsplash.com/photo-1444723121867-7a241cacace9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=60'
                }
                alt=""
                width={60}
                height={100}
                className="h-full w-full flex-1 object-cover object-center"
              />
            </Suspense>

            <div className="absolute inset-0 flex flex-1 flex-col justify-end px-2 py-4">
              <h3
                className="text-sm font-semibold text-white"
                style={{ textShadow: '0 1px 3px rgb(0, 0, 0, 0.8)' }}
              >
                {item.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
