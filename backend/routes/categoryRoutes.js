const express = require('express');

const router = express.Router();


 

const Category = require('../models/category');

const categoryController = require('../controllers/categoryController')


 

// GET all categories

router.get('/', async (req, res) => {

  try {

    const categories = await Category.find({});

    res.json(categories);

  } catch (error) {

    res.status(500).json({ message: 'Server error fetching categories' });

  }

});


 

router.post('/', async (req, res) => {

  try {

    const { name, image } = req.body;


 

    if (!name) {

      return res.status(400).json({ message: 'Category name is required' });

    }


 

    // Check for existing category by name (case-insensitive)

    const existing = await Category.findOne({ name: new RegExp(`^${name}$`, 'i') });

    if (existing) {

      return res.status(400).json({ message: 'Category already exists' });

    }


 

    const category = new Category({

      name,

      image: image || 'assets/default-category.jpg',

      createdAt: new Date()

    });


 

    await category.save();

    return res.status(201).json(category);

  } catch (err) {

    console.error('Error creating category:', err);

    return res.status(500).json({ message: 'Internal Server Error' });

  }

});


 

router.post('/api/categories', async (req, res) => {

  const { name, image } = req.body;

  try {

    const newCategory = new Category({ name, image });

    await newCategory.save();

    res.status(201).json(newCategory);

  } catch (err) {

    res.status(500).json({ error: 'Failed to create category' });

  }

});


 

router.delete('/:id',categoryController.deleteCategory);



 

module.exports = router;