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

          const existsBusRoute = await prisma.busRoute.findFirst({
            where: {
              previous_id: Number(data.cdlinha),
            },
          })

          if (!existsBusRoute) {
            return null
          }

          const newItinerary = {
            legacy_id: Number(data.cdlinhaitinerario),
            legacy_bus_route_id: Number(data.cdlinha),
            bus_route_id: existsBusRoute.id,
          }

          await prisma.itinerary.create({
            data: newItinerary,
          })

          controller.enqueue(JSON.stringify(newItinerary).concat('\n'))
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
