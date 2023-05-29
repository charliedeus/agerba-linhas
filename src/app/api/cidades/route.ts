import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../prisma'

export async function GET(request: NextRequest) {
  const cities = await prisma.city.findMany()

  return NextResponse.json(cities)
}
