import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  await prisma.timetable.deleteMany()
  await prisma.place_Itinerary.deleteMany()
  await prisma.place.deleteMany()
  await prisma.itinerary.deleteMany()
  await prisma.busRoute.deleteMany()

  return NextResponse.json({ message: true })
}
