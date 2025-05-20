const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const { getAvailableParkings, createBooking, rejectBooking, acceptBooking } = require('../controllers/bookingController');

  

// Only authenticated users can access available parkings
router.get('/available-parkings', authenticate, getAvailableParkings);

// Only authenticated drivers can create bookings
router.post('/book', authenticate, checkRole(['DRIVER']), createBooking);

// Admin can reject a booking
router.patch('/reject/:id', authenticate, checkRole(['ADMIN']), rejectBooking);

// Admin can accept a booking
router.patch('/accept/:id', authenticate, checkRole(['ADMIN']), acceptBooking);

module.exports = router;
