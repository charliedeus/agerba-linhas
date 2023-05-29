/*
  Warnings:

  - A unique constraint covering the columns `[ibge_code]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ibge_code` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "ibge_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cities_ibge_code_key" ON "cities"("ibge_code");
