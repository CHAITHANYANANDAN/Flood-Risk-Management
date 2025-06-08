const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
  name: String,
  location: String,
  capacity: Number,
  contact: String
});

module.exports = mongoose.model('Shelter', shelterSchema);
