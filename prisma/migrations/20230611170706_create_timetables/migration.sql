-- CreateEnum
CREATE TYPE "Direction" AS ENUM ('IDA', 'VOLTA');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM');

-- CreateTable
CREATE TABLE "timetables" (
    "id" TEXT NOT NULL,
    "direction" "Direction" NOT NULL DEFAULT 'IDA',
    "weekday" "WeekDay" NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "bus_route_id" TEXT NOT NULL,

    CONSTRAINT "timetables_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "timetables" ADD CONSTRAINT "timetables_bus_route_id_fkey" FOREIGN KEY ("bus_route_id") REFERENCES "bus_routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
