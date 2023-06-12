import { createReadStream } from 'node:fs'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { Readable, Transform } from 'node:stream'
import { WritableStream, TransformStream } from 'node:stream/web'
import csvtojson from 'csvtojson'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const path = `./tmp/${file.name}`
  await writeFile(path, buffer)
  console.log(`open ${path} to see the upload file`)

  Readable.toWeb(createReadStream(path))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(
      new TransformStream({
        async transform(chunk, controller) {
          const data = JSON.parse(Buffer.from(chunk).toString())

          const existsItinerary = await prisma.itinerary.findFirst({
            where: {
              legacy_id: Number(data.cdlinhaitinerario),
            },
          })

          if (!existsItinerary) {
            return null
          }

          const existsPlace = await prisma.place.findFirst({
            where: {
              legacy_id: Number(data.cdlinhalocalidade),
            },
          })

          if (!existsPlace) {
            return null
          }

          const newPlacesToItinerary = {
            section_number: Number(data.nusecao),
            is_access: Boolean(data.flacesso),
            itinerary_id: existsItinerary.id,
            place_id: existsPlace.id,
          }

          await prisma.place_Itinerary.create({
            data: newPlacesToItinerary,
          })

          controller.enqueue(JSON.stringify(newPlacesToItinerary).concat('\n'))
        },
      }),
    )
    .pipeTo(
      new WritableStream({
        async write(chunk) {
          NextResponse.next()
        },
        close() {
          NextResponse.json({ success: true })
        },
      }),
    )

  return NextResponse.json({ success: true })
}
