-- CreateTable
CREATE TABLE "bus_routes" (
    "id" TEXT NOT NULL,
    "bus_route_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bus_routes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bus_routes_bus_route_number_key" ON "bus_routes"("bus_route_number");
