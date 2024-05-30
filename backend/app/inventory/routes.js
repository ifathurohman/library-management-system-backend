const router = require('express').Router();
const transactionController = require('./controller');

router.post('/inventory', transactionController.addStockToInventory);

module.exports = router;
