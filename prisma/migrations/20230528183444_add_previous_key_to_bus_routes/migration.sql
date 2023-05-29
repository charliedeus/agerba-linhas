/*
  Warnings:

  - A unique constraint covering the columns `[previous_id]` on the table `bus_routes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `previous_id` to the `bus_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previous_parent_key` to the `bus_routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bus_routes" ADD COLUMN     "previous_id" INTEGER NOT NULL,
ADD COLUMN     "previous_parent_key" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "bus_routes_previous_id_key" ON "bus_routes"("previous_id");
