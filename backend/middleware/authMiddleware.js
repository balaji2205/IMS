// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// exports.verifyToken = async (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer TOKEN"
//   if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded._id).select('-password');
//     if (!req.user) return res.status(401).json({ message: 'Invalid token.' });
//     next();
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid or expired token.' });
//   }
// };

// exports.restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'You do not have permission to perform this action.' });
//     }
//     next();
//   };
// };
