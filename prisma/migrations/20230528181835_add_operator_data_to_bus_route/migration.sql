/*
  Warnings:

  - Added the required column `operator` to the `bus_routes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operator_id` to the `bus_routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bus_routes" ADD COLUMN     "operator" TEXT NOT NULL,
ADD COLUMN     "operator_id" TEXT NOT NULL;
