import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma'

export async function POST(request: NextRequest) {
  const { originCityId, destinyCityId } = await request.json()

  const busRoutes = await prisma.busRoute.findMany({
    where: {
      starts_in_id: originCityId !== null ? originCityId : undefined,
      ends_in_id: destinyCityId !== null ? destinyCityId : undefined,
    },
    include: {
      starts_in: true,
      ends_in: true,
      itinerary: {
        include: {
          place_itinerary: {
            include: {
              place: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      timetable: true,
    },
  })

  return NextResponse.json({ busRoutes })
}
