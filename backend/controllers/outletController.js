const Outlet = require('../models/outlet');

exports.getAllOutlets = async (req, res) => {
   try {
    const outlets = await Outlet.find()
      .populate('manager', 'username email')  // populate with limited fields
      .populate('staff', 'username email');

    res.json(outlets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOutlet = async (req, res) => {
  try {
    const { name, location, manager, staff } = req.body;

    // Basic validation
    if (!name || !location || !manager || !staff) {
      return res.status(400).json({ error: "Please provide name, location, manager and staff." });
    }

    const outlet = new Outlet({ name, location, manager, staff });
    await outlet.save();
    res.status(201).json(outlet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
