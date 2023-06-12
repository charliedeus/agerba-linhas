import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  await prisma.place.deleteMany()
  await prisma.itinerary.deleteMany()
  await prisma.busRoute.deleteMany()

  // Atualizar dados
  // 1. Linhas
  // 2. Itinerarios
  // 3. Localidades

  return NextResponse.json({ message: true })
}
