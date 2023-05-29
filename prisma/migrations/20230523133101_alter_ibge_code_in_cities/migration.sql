/*
  Warnings:

  - Changed the type of `ibge_code` on the `cities` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "cities" DROP COLUMN "ibge_code",
ADD COLUMN     "ibge_code" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cities_ibge_code_key" ON "cities"("ibge_code");
