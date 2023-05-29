-- AlterTable
ALTER TABLE "bus_routes" ADD COLUMN     "count_permit_holders" INTEGER,
ALTER COLUMN "operator" DROP NOT NULL,
ALTER COLUMN "operator_id" DROP NOT NULL;
