const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/login', async (req, res) => {
 const { email, password } = req.body;

 try {
   const user = await User.findOne({ email, password }); // plain-text match
   if (!user) return res.status(401).json({ message: 'Invalid credentials' });

   return res.status(200).json({
     message: 'Login successful',
     user: {
       email: user.email,
       role: user.role
     }
   });
 } catch (err) {
   return res.status(500).json({ message: 'Server error', error: err });
 }
});

module.exports = router;