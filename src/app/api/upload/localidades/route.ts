import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

import legacyPlaces from '../../../../legacyData/legacyLocalidades'

export async function GET(request: NextRequest) {
  const legacyLocalidades = legacyPlaces.map((place) => {
    return {
      name: place.denome,
      legacy_id: place.cdlinhalocalidade,
    }
  })

  await prisma.place.createMany({
    data: legacyLocalidades,
  })

  return NextResponse.json({ message: 'Places updated' })
}
