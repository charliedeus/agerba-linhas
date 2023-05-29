/*
  Warnings:

  - Added the required column `count_destiny_views` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `count_origin_views` to the `cities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "count_destiny_views" INTEGER NOT NULL,
ADD COLUMN     "count_origin_views" INTEGER NOT NULL;
