const mongoose = require('mongoose');


 

const userSchema = new mongoose.Schema({

  username: String,

  email: String,

  password: String, // bcrypt hash

  role: { type: String, enum: ['admin', 'manager', 'staff'] },

  outletId : { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet'},

  isActive: Boolean,

  createdAt: Date,

  img:String

});


 

module.exports = mongoose.model('User', userSchema);