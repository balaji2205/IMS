const express = require('express');
const router = express.Router();
// const outletController = require('../controllers/outletController');
const outletController = require('../controllers/outletController');

router.get('/', outletController.getAllOutlets);
router.post('/', outletController.createOutlet);

module.exports = router;
