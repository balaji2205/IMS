const User = require('../models/user');


 

// Get all users

exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find({}, '-password'); // exclude password

    res.json(users);

  } catch (err) {

    res.status(500).json({ message: 'Server error' });

  }

};


 

// Create user

exports.createUser = async (req, res) => {

  try {

    const { username, email, password, role } = req.body;

    const newUser = new User({ username, email, password, role, isActive: true, createdAt: new Date() });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {

    res.status(400).json({ message: 'User creation failed' });

  }

};


 

// Update user

exports.updateUser = async (req, res) => {

  try {

    const user = await User.findByIdAndUpdate(req.params.id, req.body);

    res.json({ message: 'User updated', user });

  } catch (err) {

    res.status(400).json({ message: 'User update failed' });

  }

};


 

// Delete user

exports.deleteUser = async (req, res) => {

  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted' });

  } catch (err) {

    res.status(400).json({ message: 'User deletion failed' });

  }

};



 

exports.getManagerOutletAndStaff = async (req, res) => {

 try {

   const { email } = req.query;


 

   // Find manager

   const manager = await User.findOne({ email, role: 'manager' }).populate('outletId');

   if (!manager) return res.status(404).json({ message: 'Manager not found' });


 

   // Find staff in the same outlet

   const staffList = await User.find({ role: 'staff', outletId: manager.outletId }, '-password');


 

   res.json({

     outlet: manager.outletId,

     staff: staffList

   });

 } catch (err) {

   res.status(500).json({ message: 'Server error', error: err });

 }

};


 

exports.getOutletInfo = async (req, res) => {

 try {

   const email = req.params.email;


 

   const user = await User.findOne({ email }).populate('outletId'); // populate the outlet


 

   if (!user) {

     return res.status(404).json({ message: "User not found" });

   }


 

   res.status(200).json({

     outletName: user.outlet?.outletName || '',

     managerName: user.name || '', // optional: if you want to return manager's name

   });

 } catch (err) {

   console.error(err);

   res.status(500).json({ message: "Server error" });

 }

};

