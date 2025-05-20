/*
  Warnings:

  - A unique constraint covering the columns `[parkingSpaceId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parkingSpaceId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "parkingSpaceId" INTEGER ;

-- CreateTable
CREATE TABLE "ParkingSpace" (
    "id" SERIAL NOT NULL,
    "spaceCode" TEXT NOT NULL,
    "parkingId" INTEGER NOT NULL,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ParkingSpace_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParkingSpace_spaceCode_key" ON "ParkingSpace"("spaceCode");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_parkingSpaceId_key" ON "Booking"("parkingSpaceId");

-- AddForeignKey
ALTER TABLE "ParkingSpace" ADD CONSTRAINT "ParkingSpace_parkingId_fkey" FOREIGN KEY ("parkingId") REFERENCES "Parking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_parkingSpaceId_fkey" FOREIGN KEY ("parkingSpaceId") REFERENCES "ParkingSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
