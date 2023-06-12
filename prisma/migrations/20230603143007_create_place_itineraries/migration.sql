-- CreateTable
CREATE TABLE "places_itineraries" (
    "id" TEXT NOT NULL,
    "section_number" INTEGER NOT NULL,
    "itinerary_id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,

    CONSTRAINT "places_itineraries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "places_itineraries" ADD CONSTRAINT "places_itineraries_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places_itineraries" ADD CONSTRAINT "places_itineraries_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
