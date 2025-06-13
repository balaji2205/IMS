const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reportController');


 

// GET /api/reports/stock

router.get('/stock', reportController.generateStockReport);

router.get('/reports', reportController.getAllReports);

router.get('/reports/:filename', reportController.downloadReport);

module.exports = router;