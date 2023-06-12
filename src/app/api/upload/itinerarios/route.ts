import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

import legacyItinerary from '../../../../legacyData/legacyItinerarios'

interface ItineraryProps {
  legacy_id: number
  legacy_bus_route_id: number
  bus_route_id: string
}

export async function GET(request: NextRequest) {
  const legacyItineraries = await Promise.all(
    legacyItinerary.map(async (item) => {
      const existsBusRoute = await prisma.busRoute.findFirst({
        where: {
          previous_id: item.cdlinha,
        },
      })

      if (!existsBusRoute) {
        return null
      }

      return {
        legacy_id: item.cdlinhaitinerario,
        legacy_bus_route_id: item.cdlinha,
        bus_route_id: existsBusRoute.id,
      }
    }),
  )

  const newItineraries = legacyItineraries.filter(
    (item): item is ItineraryProps => item !== null,
  )

  await prisma.itinerary.createMany({
    data: newItineraries,
  })

  return NextResponse.json({ message: 'Itineraries updated' })
}
