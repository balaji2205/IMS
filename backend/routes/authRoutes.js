const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController'); // adjust path as needed


 

router.post('/login', authController.login);


 

module.exports = router;


 



