const mongoose = require('mongoose');

const outletSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Outlet', outletSchema);
