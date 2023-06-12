/*
  Warnings:

  - Added the required column `is_access` to the `places_itineraries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "places_itineraries" ADD COLUMN     "is_access" BOOLEAN NOT NULL;
