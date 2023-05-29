import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../prisma'

export async function GET(request: NextRequest) {
  const cities = await prisma.city.findMany({
    include: {
      starts_in: true,
      ends_in: true,
    },
  })

  const result = cities.map((city) => {
    const countStartsIn = city.starts_in.length
    const countEndsIn = city.ends_in.length
    const totalAttendeds = countStartsIn + countEndsIn

    return {
      id: city.id,
      name: city.name,
      attendeds: totalAttendeds,
    }
  })

  const orderedResult = result
    .sort((a, b) => b.attendeds - a.attendeds)
    .slice(0, 10)

  return NextResponse.json({ orderedResult })
}
