const router = require("express").Router();
const reportHistory = require("./controller");

router.get('/report', reportHistory.reportBorrowingHistory);

module.exports = router;
