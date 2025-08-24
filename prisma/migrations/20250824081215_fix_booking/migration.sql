/*
  Warnings:

  - A unique constraint covering the columns `[placeId,startDate,endDate,status]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Booking_placeId_startDate_endDate_key";

-- CreateIndex
CREATE UNIQUE INDEX "Booking_placeId_startDate_endDate_status_key" ON "public"."Booking"("placeId", "startDate", "endDate", "status");
