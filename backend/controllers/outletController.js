const Outlet = require('../models/outlet');

exports.getAllOutlets = async (req, res) => {
  try {
    const outlets = await Outlet.find();
    res.json(outlets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOutlet = async (req, res) => {
  try {
    const outlet = new Outlet(req.body);
    await outlet.save();
    res.status(201).json(outlet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
