/*
  Warnings:

  - Changed the type of `direction` on the `timetables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `weekday` on the `timetables` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "timetables" DROP COLUMN "direction",
ADD COLUMN     "direction" TEXT NOT NULL,
DROP COLUMN "weekday",
ADD COLUMN     "weekday" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Direction";

-- DropEnum
DROP TYPE "WeekDay";
