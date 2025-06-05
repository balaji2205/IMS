
const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const productController = require('../controllers/productController')

router.get('/', productController.getAllProducts);

// GET products by category
router.get('/category/:categoryName', async (req, res) => {
  try {
    const categoryName = req.params.categoryName;
    const products = await Product.find({ category: categoryName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products' });
  }
});
// Bulk stock update for multiple products
router.put('/update-stock', async (req, res) => {
  const updates = req.body; // should be an array: [{ id, quantityChange }]

  try {
    for (const update of updates) {
      const product = await Product.findById(update.id);
      if (!product) continue;

      const newQuantity = product.quantity + update.quantityChange;

      if (newQuantity < 0 || newQuantity > product.maxStock) {
        return res.status(400).json({
          error: `Invalid stock for product ${product.name}. Quantity must be between 0 and ${product.maxStock}`
        });
      }

      product.quantity = newQuantity;
      await product.save();
    }

    res.json({ message: 'Stock updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Stock update failed' });
  }
});


// POST add new product
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, threshold, createdBy } = req.body;
    if (!name || !category || quantity == null || threshold == null || !createdBy) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = new Product({
      name,
      category,
      quantity,
      threshold,
      createdBy,
      isActive: true,
      createdAt: new Date()
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error adding product' });
  }
});

// PUT update product quantity/threshold
router.put('/:productId/capacity', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, threshold,capacity } = req.body;

    if (quantity == null && threshold == null && capacity ==null) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const updateFields = {};
    if (quantity != null) updateFields.quantity = quantity;
    if (threshold != null) updateFields.threshold = threshold;
    if(capacity != null) updateFields.capacity = capacity;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating product capacity' });
  }
});

// DELETE product by id
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting product' });
  }
});

module.exports = router;

