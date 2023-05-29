/*
  Warnings:

  - Added the required column `ends_in` to the `bus_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `starts_in` to the `bus_routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bus_routes" ADD COLUMN     "ends_in" TEXT NOT NULL,
ADD COLUMN     "starts_in" TEXT NOT NULL;
