const router = require('express').Router();
const transactionController = require('./controller');

router.get('/transactions', transactionController.index);
router.post('/transactions', transactionController.createTransaction);

module.exports = router;
