const express = require('express');

const router = express.Router();

// const outletController = require('../controllers/outletController');

const outletController = require('../controllers/outletController');


 

router.get('/', outletController.getAllOutlets);

router.post('/', outletController.createOutlet);


 

router.put('/:id', outletController.updateOutlet);

router.get('/:id/manager', outletController.getManagerByOutletId);

router.get('/:outletId/staff',outletController.getStaffByOutletId)

module.exports = router;


 





