const mongoose = require('mongoose');


 

const productSchema = new mongoose.Schema({

  name: String,

  category: String,

  quantity: Number,

  threshold: Number,

  maxStock: Number,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  isActive: Boolean,

  createdAt: Date,

  stocks: [{

    outlet: { type: mongoose.Schema.Types.ObjectId, ref: 'Outlet' },

    quantity: { type: Number, default: 0 }

  }]

});


 

module.exports = mongoose.model('Product', productSchema);


 

