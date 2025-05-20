-- CreateTable
CREATE TABLE "CarEntry" (
    "id" SERIAL NOT NULL,
    "platenumber" TEXT NOT NULL,
    "parkingCode" TEXT NOT NULL,
    "parkingSpaceId" INTEGER,
    "entryDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "exitDateTime" TIMESTAMP(3),
    "chargedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "CarEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarEntry_platenumber_idx" ON "CarEntry"("platenumber");

-- AddForeignKey
ALTER TABLE "CarEntry" ADD CONSTRAINT "CarEntry_parkingSpaceId_fkey" FOREIGN KEY ("parkingSpaceId") REFERENCES "ParkingSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
