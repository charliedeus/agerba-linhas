/*
  Warnings:

  - You are about to drop the column `cityId` on the `bus_routes` table. All the data in the column will be lost.
  - You are about to drop the column `legacyId` on the `places` table. All the data in the column will be lost.
  - Added the required column `legacy_id` to the `places` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "bus_routes" DROP CONSTRAINT "bus_routes_cityId_fkey";

-- AlterTable
ALTER TABLE "bus_routes" DROP COLUMN "cityId",
ADD COLUMN     "city_id" TEXT;

-- AlterTable
ALTER TABLE "places" DROP COLUMN "legacyId",
ADD COLUMN     "legacy_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "bus_routes" ADD CONSTRAINT "bus_routes_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
