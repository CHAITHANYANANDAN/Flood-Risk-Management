const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// POST /api/alerts
router.post('/', async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json({ message: 'Alert saved', alert });
  } catch (err) {
    res.status(500).json({ message: 'Error saving alert', error: err.message });
  }
});

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching alerts' });
  }
});

module.exports = router;
