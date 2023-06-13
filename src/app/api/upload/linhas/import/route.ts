import { createReadStream } from 'node:fs'
import { writeFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import { Readable, Transform } from 'node:stream'
import { WritableStream, TransformStream } from 'node:stream/web'
import csvtojson from 'csvtojson'
import { prisma } from '@/lib/prisma'
import unidecode from 'unidecode'

interface CityProps {
  id: string
  ibge_code: number
  name: string
  cover_url: string | null
}

export async function POST(request: NextRequest) {
  const cities = await prisma.city.findMany()

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
            cdlinha: Number(data.cdlinha),
            cdlinhapai: Number(data.cdlinhapai) || null,
            nulinha: data.nulinha,
            dedescricao: data.dedescricao,
            deorigem: data.deorigem,
            dedestino: data.dedestino,
            derazaosocial: data.derazaosocial || null,
            decnpjmatriz: data.decnpjmatriz || null,
            nupermissionarios: Number(data.nupermissionarios) || null,
          }

          const originCity: CityProps | undefined = cities.find((city) =>
            String(unidecode(city.name.toLowerCase())).includes(
              unidecode(mappedData.deorigem.toLowerCase()),
            ),
          )

          if (!originCity) {
            // eslint-disable-next-line
            return
          }

          const destinyCity: CityProps | undefined = cities.find((city) =>
            String(unidecode(city.name.toLowerCase())).includes(
              unidecode(mappedData.dedestino.toLowerCase()),
            ),
          )

          if (!destinyCity) {
            // eslint-disable-next-line
            return
          }

          const newBusRoute = {
            bus_route_number: mappedData.nulinha,
            name: mappedData.dedescricao.toUpperCase(),
            operator: mappedData.derazaosocial?.toUpperCase() || null,
            operator_id: mappedData.decnpjmatriz || null,
            count_permit_holders: Number(mappedData.nupermissionarios) || null,
            previous_id: Number(mappedData.cdlinha),
            previous_parent_key: Number(mappedData.cdlinhapai) || null,
            starts_in_id: originCity.id,
            ends_in_id: destinyCity.id,
          }

          await prisma.busRoute.create({
            data: newBusRoute,
          })

          controller.enqueue(JSON.stringify(newBusRoute).concat('\n'))
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
