const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register car entry
exports.registerCarEntry = async (req, res) => {
  const { platenumber, parkingCode, parkingSpaceId } = req.body;

  try {
    // 1. Check if parking exists and has available space
    const parking = await prisma.parking.findUnique({ where: { code: parkingCode } });
    if (!parking) return res.status(404).json({ message: 'Parking not found' });
    if (parking.availableSpaces <= 0) return res.status(400).json({ message: 'No available spaces' });

    // 2. Create car entry
    const carEntry = await prisma.carEntry.create({
      data: {
        platenumber,
        parkingCode,
        parkingSpaceId,
        entryDateTime: new Date(),
      },
    });

    // 3. Decrement available spaces in Parking
    await prisma.parking.update({
      where: { code: parkingCode },
      data: { availableSpaces: { decrement: 1 } },
    });

    // 4. Mark parkingSpace as reserved if parkingSpaceId given
    if (parkingSpaceId) {
      await prisma.parkingSpace.update({
        where: { id: parkingSpaceId },
        data: { isReserved: true },
      });
    }

    // 5. Return ticket info
    res.status(201).json({
      message: 'Car entry registered',
      ticket: {
        id: carEntry.id,
        platenumber: carEntry.platenumber,
        parkingCode: carEntry.parkingCode,
        parkingSpaceId: carEntry.parkingSpaceId,
        entryDateTime: carEntry.entryDateTime,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Register car exit
exports.registerCarExit = async (req, res) => {
  const carEntryId = parseInt(req.params.id);

  try {
    // 1. Find car entry
    const carEntry = await prisma.carEntry.findUnique({ where: { id: carEntryId } });
    if (!carEntry) return res.status(404).json({ message: 'Car entry not found' });
    if (carEntry.exitDateTime) return res.status(400).json({ message: 'Car has already exited' });

    // 2. Calculate parking duration and fee
    const exitTime = new Date();
    const entryTime = new Date(carEntry.entryDateTime);
    const diffMs = exitTime - entryTime;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60)); // round up hours

    // 3. Get charging fee rate
    const parking = await prisma.parking.findUnique({ where: { code: carEntry.parkingCode } });
    if (!parking) return res.status(404).json({ message: 'Parking not found' });

    const chargedAmount = diffHours * parking.chargingFeePerHour;

    // 4. Update car entry with exit info and charged amount
    const updatedEntry = await prisma.carEntry.update({
      where: { id: carEntryId },
      data: {
        exitDateTime: exitTime,
        chargedAmount,
      },
    });

    // 5. Increment availableSpaces in Parking
    await prisma.parking.update({
      where: { code: carEntry.parkingCode },
      data: { availableSpaces: { increment: 1 } },
    });

    // 6. Free up parking space if assigned
    if (carEntry.parkingSpaceId) {
      await prisma.parkingSpace.update({
        where: { id: carEntry.parkingSpaceId },
        data: { isReserved: false },
      });
    }

    // 7. Return bill info
    res.json({
      message: 'Car exit registered',
      bill: {
        platenumber: updatedEntry.platenumber,
        parkingCode: updatedEntry.parkingCode,
        durationHours: diffHours,
        chargedAmount,
        exitDateTime: updatedEntry.exitDateTime,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
