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
    // eslint-disable-line
    // @ts-ignore
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(
      new TransformStream({
        async transform(chunk: Uint8Array, controller): Promise<void> {
          const data = JSON.parse(Buffer.from(chunk).toString('utf-8'))
          const mappedData = {
            denome: String(data.denome),
            cdlinhalocalidade: Number(data.cdlinhalocalidade),
          }

          const newPlace = {
            legacy_id: Number(mappedData.cdlinhalocalidade),
            name: mappedData.denome,
          }

          await prisma.place.create({
            data: newPlace,
          })

          controller.enqueue(JSON.stringify(newPlace).concat('\n'))
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
