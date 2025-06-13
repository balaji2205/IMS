const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// const { verifyToken, restrictTo } = require('../middleware/authMiddleware');


 

// router.use(verifyToken, restrictTo('admin'));


 

router.get('/', userController.getAllUsers);

router.post('/', userController.createUser);

router.put('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.get('/manager-details', userController.getManagerOutletAndStaff);

router.get('/getOutletInfo/:email',userController.getOutletInfo)



 

module.exports = router;


 