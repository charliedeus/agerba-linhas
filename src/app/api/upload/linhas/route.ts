import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import unidecode from 'unidecode'

import legacyLinhas from '@/legacyData/legacyLinhas'

interface CityProps {
  id: string
  ibge_code: number
  name: string
  cover_url: string | null
}

interface BusRouteProps {
  id?: string
  bus_route_number: string
  name: string
  operator: string | null
  operator_id: string | null
  count_permit_holders: number | null
  previous_id: number
  previous_parent_key: number | null

  starts_in_id: string
  ends_in_id: string
}

export async function GET(request: NextRequest) {
  const cities = await prisma.city.findMany()

  const newBusRoutes = legacyLinhas
    .map((item) => {
      const originCity: CityProps | undefined = cities.find((city) =>
        String(unidecode(city.name.toLowerCase())).includes(
          unidecode(item.deorigem.toLowerCase()),
        ),
      )

      if (!originCity) {
        // eslint-disable-next-line
        return null
      }

      const destinyCity: CityProps | undefined = cities.find((city) =>
        String(unidecode(city.name.toLowerCase())).includes(
          unidecode(item.dedestino.toLowerCase()),
        ),
      )

      if (!destinyCity) {
        // eslint-disable-next-line
        return null
      }

      return {
        bus_route_number: item.nulinha,
        name: item.dedescricao.toUpperCase(),
        operator: item.derazaosocial?.toUpperCase() || null,
        operator_id: item.decnpjmatriz || null,
        count_permit_holders: item.nupermissionarios || null,
        previous_id: item.cdlinha,
        previous_parent_key: item.cdlinhapai || null,
        starts_in_id: originCity.id,
        ends_in_id: destinyCity.id,
      }
    })
    .filter((item): item is BusRouteProps => item !== null)

  await prisma.busRoute.createMany({
    data: newBusRoutes,
  })

  return NextResponse.json({ message: 'BusRoutes updated' })
}
