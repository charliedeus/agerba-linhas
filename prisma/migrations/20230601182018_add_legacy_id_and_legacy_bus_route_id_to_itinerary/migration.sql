/*
  Warnings:

  - Added the required column `legacyBusRouteId` to the `itineraries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `legacyId` to the `itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "itineraries" ADD COLUMN     "legacyBusRouteId" INTEGER NOT NULL,
ADD COLUMN     "legacyId" INTEGER NOT NULL;
