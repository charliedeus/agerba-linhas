-- CreateTable
CREATE TABLE "popular_bus_routes" (
    "id" TEXT NOT NULL,
    "number_of_views" INTEGER NOT NULL DEFAULT 0,
    "bus_route_id" TEXT NOT NULL,

    CONSTRAINT "popular_bus_routes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "popular_bus_routes" ADD CONSTRAINT "popular_bus_routes_bus_route_id_fkey" FOREIGN KEY ("bus_route_id") REFERENCES "bus_routes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
