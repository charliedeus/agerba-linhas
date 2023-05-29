import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma'

export async function GET(request: NextRequest) {
  const mostPopularDestinyCities = await prisma.city.findMany({
    select: {
      name: true,
      count_destiny_views: true,
    },
    orderBy: [
      {
        count_destiny_views: 'desc',
      },
      {
        name: 'asc',
      },
    ],
    take: 3,
  })

  return NextResponse.json({ mostPopularDestinyCities })
}
