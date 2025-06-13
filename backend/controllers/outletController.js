const Outlet = require('../models/outlet');


 

exports.getAllOutlets = async (req, res) => {

  try {

    const outlets = await Outlet.find()

    .populate('manager','username')

    .populate('staff','username');

    res.json(outlets);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


 

exports.createOutlet = async (req, res) => {

  try {

    console.log("body",req.body)

    const outlet = new Outlet({

      name: req.body.name,

      location: req.body.location,

      manager: req.body.manager,

      staff: req.body.staff

    }

     

    );

    await outlet.save();

    res.status(201).json(outlet);

  } catch (error) {

    res.status(400).json({ error: error.message });

  }

};

exports.updateOutlet = async (req, res) => {

  try {

    const outletId = req.params.id;

    const updatedData = {

      name: req.body.name,

      location: req.body.location,

      manager: req.body.manager,

      staff: req.body.staff

    };


 

    const updatedOutlet = await Outlet.findByIdAndUpdate(outletId, updatedData, {

      new: true,

      runValidators: true

    });


 

    if (!updatedOutlet) {

      return res.status(404).json({ message: 'Outlet not found' });

    }


 

    res.json(updatedOutlet);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }




 

};

exports.getManagerByOutletId = async (req, res) => {

  try {

    const outletId = req.params.id;

    const outlet = await Outlet.findById(outletId)

      .select('name manager staff')            // include outlet name and manager

      .populate('manager', 'username email')   // populate manager fields

      .populate('staff', 'username email');    // optional if you want staff too


 

    if (!outlet) return res.status(404).json({ message: 'Outlet not found' });

    if (!outlet.manager) return res.status(404).json({ message: 'Manager not assigned' });


 

    // return an object with both outlet name and manager info

    res.json({

      outletName: outlet.name,

      manager: outlet.manager,

      staff: outlet.staff  // optional

    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getStaffByOutletId = async (req, res) => {

  const { outletId } = req.params;


 

  try {

    const outlet = await Outlet.findById(outletId).populate('staff', 'username email').populate('name');

    if (!outlet) {

      return res.status(404).json({ message: 'Outlet not found' });

    }


 

    res.status(200).json({ outletName: outlet.name,staff: outlet.staff });

  } catch (err) {

    console.error('Error fetching staff:', err);

    res.status(500).json({ message: 'Server error' });

  }

};