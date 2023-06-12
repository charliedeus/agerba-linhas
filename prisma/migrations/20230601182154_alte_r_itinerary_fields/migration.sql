/*
  Warnings:

  - You are about to drop the column `legacyBusRouteId` on the `itineraries` table. All the data in the column will be lost.
  - You are about to drop the column `legacyId` on the `itineraries` table. All the data in the column will be lost.
  - Added the required column `legacy_bus_route_id` to the `itineraries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacy_id` to the `itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itineraries" DROP COLUMN "legacyBusRouteId",
DROP COLUMN "legacyId",
ADD COLUMN     "legacy_bus_route_id" INTEGER NOT NULL,
ADD COLUMN     "legacy_id" INTEGER NOT NULL;
