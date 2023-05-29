/*
  Warnings:

  - You are about to drop the column `ends_in` on the `bus_routes` table. All the data in the column will be lost.
  - You are about to drop the column `starts_in` on the `bus_routes` table. All the data in the column will be lost.
  - Added the required column `ends_in_id` to the `bus_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starts_in_id` to the `bus_routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bus_routes" DROP COLUMN "ends_in",
DROP COLUMN "starts_in",
ADD COLUMN     "cityId" TEXT,
ADD COLUMN     "ends_in_id" TEXT NOT NULL,
ADD COLUMN     "starts_in_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cities" ALTER COLUMN "cover_url" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bus_routes" ADD CONSTRAINT "bus_routes_starts_in_id_fkey" FOREIGN KEY ("starts_in_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_routes" ADD CONSTRAINT "bus_routes_ends_in_id_fkey" FOREIGN KEY ("ends_in_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bus_routes" ADD CONSTRAINT "bus_routes_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
