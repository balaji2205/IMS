const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  createdAt: Date,
  image: String
});

module.exports = mongoose.model('Category', categorySchema);
