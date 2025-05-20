const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middlewares/authMiddleware');
const { registerCarEntry, registerCarExit } = require('../controllers/carEntryController');

// Register car entry (driver only)
router.post('/entry', authenticate, checkRole(['DRIVER']), registerCarEntry);

// Register car exit (driver only)
router.patch('/exit/:id', authenticate, checkRole(['DRIVER']), registerCarExit);

module.exports = router;
