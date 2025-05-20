const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAvailableParkings = async (req, res) => {
    try {
      const parkings = await prisma.parking.findMany({
        include: {
          spaces: {
            where: { isReserved: false },
            select: {
              id: true,
              spaceCode: true,
            },
          },
        },
      });
  
      res.status(200).json(parkings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  exports.createBooking = async (req, res) => {
    const { parkingSpaceId, platenumber } = req.body;
    const userId = req.user.userId;
  
    try {
      // 1. Check if platenumber already has an active booking
      const existingBooking = await prisma.booking.findFirst({
        where: { platenumber, status: 'reserved' },
      });
      if (existingBooking) {
        return res.status(400).json({ message: 'This plate already has a reserved booking.' });
      }
  
      // 2. Check if the parking space exists and is not reserved
      const space = await prisma.parkingSpace.findUnique({
        where: { id: parkingSpaceId },
        include: { parking: true },
      });
  
      if (!space || space.isReserved) {
        return res.status(400).json({ message: 'Parking space is not available.' });
      }
  
      // 3. Create booking and mark space as reserved
      const booking = await prisma.booking.create({
        data: {
          userId,
          parkingCode: space.parking.code,
          parkingSpaceId: space.id,
          platenumber,
        },
      });
  
      await prisma.parkingSpace.update({
        where: { id: space.id },
        data: { isReserved: true },
      });
  
      res.status(201).json({ message: 'Booking created.', booking });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// admin accept booking
exports.acceptBooking = async (req, res) => {
    const bookingId = parseInt(req.params.id);
  
    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'accepted' },
      });
  
      res.json({ message: 'Booking accepted.', booking });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.rejectBooking = async (req, res) => {
    const bookingId = parseInt(req.params.id);
  
    try {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'rejected' },
      });
  
      res.json({ message: 'Booking rejected.', booking });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  