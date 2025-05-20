-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_parkingSpaceId_fkey";

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_parkingSpaceId_fkey" FOREIGN KEY ("parkingSpaceId") REFERENCES "ParkingSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
