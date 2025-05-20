const express = require('express');
const router = express.Router();
const { registerParking, viewAvailableParkings } = require('../controllers/parkingController');
const {authenticate} = require('../middlewares/authMiddleware');

// Only admin can register parking
router.post('/register', authenticate, (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Access denied' });
  next();
}, registerParking);

// Drivers can view available parking
router.get('/available', authenticate, viewAvailableParkings);

module.exports = router;
