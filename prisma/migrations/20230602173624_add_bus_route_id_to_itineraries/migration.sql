/*
  Warnings:

  - Added the required column `bus_route_id` to the `itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itineraries" ADD COLUMN     "bus_route_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_bus_route_id_fkey" FOREIGN KEY ("bus_route_id") REFERENCES "bus_routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
