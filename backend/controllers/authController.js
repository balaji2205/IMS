// const  jwt = require('jsonwebtoken');

// const User = require('../models/user');  // Ensure the correct path to the User model


 

// // POST /api/auth/login

// exports.login = async (req, res) => {

//   const { email, password } = req.body;




 

//   if (!email || !password) {

//     return res.status(400).json({ message: "Please provide both email and password." });

//   }


 

//   try {

//     // Find the user by email

//     // const user = await User.findOne({ email: email.toLowerCase() }).populate('outletId');

//     const user = await User.findOne({ email: email.toLowerCase() }).populate('outletId', 'name location');

//     console.log(user);

   


 

//     if (!user) {

//       return res.status(400).json({ message: "Invalid credentials" });  // User not found

//     }


 

//     // Compare the plain-text password (no bcrypt)

//     if (password !== user.password) {

//       return res.status(400).json({ message: "Invalid credentials" });  // Incorrect password

//     }


 

//     // Generate JWT token

//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

// console.log(user.outletId);


 

//     res.status(200).json({ message: "Login successful", token, user:{

//       _id: user._id,

//     username: user.username,

//     email: user.email,

//     role: user.role,

//     outletId: user.outletId?._id,

//     outletName: user.outletId?.name,

//     manager: user.outletId?.manager,  // optional if you want

//     staff: user.outletId?.staff

     

//     } });

   

   


 

//   } catch (err) {

//     console.error(err);

//     res.status(500).json({ message: "Server error" });

//   }

// };



 

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const Outlet = require('../models/outlet'); // <-- import Outlet for dynamic lookup


 

// POST /api/auth/login

exports.login = async (req, res) => {

  const { email, password } = req.body;


 

  if (!email || !password) {

    return res.status(400).json({ message: "Please provide both email and password." });

  }


 

  try {

    // Find the user

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || user.password !== password) {

      return res.status(401).json({ message: "Invalid credentials" });

    }


 

    let outletData = null;


 

    // If manager or staff, fetch outlet dynamically using Outlet model

    if (user.role === 'manager') {

      outletData = await Outlet.findOne({ manager: user._id }).lean();

    } else if (user.role === 'staff') {

      outletData = await Outlet.findOne({ staff: user._id }).lean();

    }


 

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });


 

    res.status(200).json({

      message: "Login successful",

      token,

      user: {

        _id: user._id,

        username: user.username,

        email: user.email,

        role: user.role,

        outletId: outletData?._id || null,

        outletName: outletData?.name || null,

        manager: outletData?.manager || null,

        staff: outletData?.staff || null

      }

    });

  } catch (err) {

    console.error('Login error:', err);

    res.status(500).json({ message: "Server error" });

  }

};