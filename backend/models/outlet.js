const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: String
});

module.exports = mongoose.model('Outlet', outletSchema);
