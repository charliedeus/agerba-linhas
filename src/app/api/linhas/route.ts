import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma'

export async function GET(request: NextRequest) {
  const busRoutes = await prisma.busRoute.findMany({
    select: {
      id: true,
      name: true,
      starts_in_id: true,
      ends_in_id: true,
      starts_in: {
        select: {
          id: true,
          name: true,
          cover_url: true,
        },
      },
      ends_in: {
        select: {
          id: true,
          name: true,
          cover_url: true,
        },
      },
    },
  })

  return NextResponse.json({ busRoutes })
}
