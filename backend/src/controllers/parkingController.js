const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 1. Register a parking
exports.registerParking = async (req, res) => {
    const { code, name, location, availableSpaces, chargingFeePerHour } = req.body;
    try {
      const parking = await prisma.parking.create({
        data: {
          code,
          name,
          location,
          availableSpaces: parseInt(availableSpaces),
          chargingFeePerHour: parseFloat(chargingFeePerHour),
          spaces: {
            create: Array.from({ length: parseInt(availableSpaces) }, (_, i) => ({
              spaceCode: `${code}-S${i + 1}`,
            })),
          },
        },
        include: { spaces: true },
      });
  
      res.status(201).json({ message: 'Parking registered with spaces', parking });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// 2. View all available parking spaces
exports.viewAvailableParkings = async (req, res) => {
  try {
    const parkings = await prisma.parking.findMany({
      where: {
        availableSpaces: {
          gt: 0,
        },
      },
      select: {
        id: true,
        name: true,
        location: true,
        availableSpaces: true,
        chargingFeePerHour: true,
      },
    });
    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
