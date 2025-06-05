const Product = require('../models/product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'username email');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('stocks.outlet');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

 exports.updateStock = async (req, res) => {
 try {
   const { id } = req.params;
   const { outletId, quantity } = req.body;

   if (!outletId || quantity == null) {
     return res.status(400).json({ error: 'Outlet ID and quantity are required' });
   }

   const product = await Product.findById(id);
   if (!product) {
     return res.status(404).json({ error: 'Product not found' });
   }

   let stock = product.stocks.find(s => s.outlet.toString() === outletId);

   if (stock) {
     stock.quantity = quantity;
   } else {
     product.stocks.push({ outlet: outletId, quantity });
   }

   // Optional: Recalculate total quantity
   product.quantity = product.stocks.reduce((acc, s) => acc + s.quantity, 0);

   await product.save();
   res.json(product);
 } catch (error) {
   console.error('Error updating stock:', error);
   res.status(500).json({ error: error.message });
 }
};