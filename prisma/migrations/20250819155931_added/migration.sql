/*
  Warnings:

  - A unique constraint covering the columns `[placeId,startDate,endDate]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."userRole" AS ENUM ('regular', 'host');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('available', 'booked');

-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "status" "public"."BookingStatus" NOT NULL DEFAULT 'available';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
ADD COLUMN     "role" "public"."userRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_placeId_startDate_endDate_key" ON "public"."Booking"("placeId", "startDate", "endDate");
