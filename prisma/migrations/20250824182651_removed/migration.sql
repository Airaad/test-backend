/*
  Warnings:

  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Booking_placeId_startDate_endDate_status_key";

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
