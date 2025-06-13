const Category = require('../models/category');


 

exports.getAllCategories = async (req, res) => {

  try {

    const categories = await Category.find();

    res.json(categories);

  } catch (err) {

    res.status(500).json({ message: 'Failed to get categoriess' });

  }

}

  exports.deleteCategory = async (req, res) => {

    try {

      const deletedCategory = await Category.findByIdAndDelete(req.params.id);

      if(!deletedCategory){

        return res.status(404).json({message: 'Category not found'})

      }

      res.status(200).json({message: 'Category deleted successfully'})

    } catch (err) {

      console.error('Error deleting category:',err)

      res.status(500).json({ message: 'Server error' });

    }

};