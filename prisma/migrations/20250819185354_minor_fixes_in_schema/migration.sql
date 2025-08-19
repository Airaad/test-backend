/*
  Warnings:

  - The values [available,booked] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hostId` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `hostId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."BookingStatus_new" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Booking" ALTER COLUMN "status" TYPE "public"."BookingStatus_new" USING ("status"::text::"public"."BookingStatus_new");
ALTER TYPE "public"."BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "public"."BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_hostId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_hostId_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "hostId";

-- AlterTable
ALTER TABLE "public"."Listing" ALTER COLUMN "thumbnail" SET DATA TYPE TEXT,
ALTER COLUMN "averageRating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Review" DROP COLUMN "hostId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
