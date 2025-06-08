const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');

// Add shelter
router.post('/', async (req, res) => {
  const shelter = new Shelter(req.body);
  await shelter.save();
  res.json({ message: "Shelter added", shelter });
});

// Get all shelters
router.get('/', async (req, res) => {
  const shelters = await Shelter.find();
  res.json(shelters);
});

module.exports = router;
