import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma'

export async function GET(request: NextRequest) {
  const allCities = await prisma.city.findMany()
  const MostAttendedCities = await prisma.city.findMany({
    include: {
      starts_in: true,
      ends_in: true,
    },
  })

  const result = MostAttendedCities.map((city) => {
    const countStartsIn = city.starts_in.length
    const countEndsIn = city.ends_in.length
    const totalAttendeds = countStartsIn + countEndsIn

    return {
      id: city.id,
      name: city.name,
      attendeds: totalAttendeds,
      coverUrl: city.cover_url,
    }
  })

  const orderedResultMostAttendedCities = result
    .sort((a, b) => b.attendeds - a.attendeds)
    .slice(0, 10)

  return NextResponse.json({ allCities, orderedResultMostAttendedCities })
}
