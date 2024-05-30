const router = require('express').Router();
const bookController = require('./controller');

router.get('/book', bookController.index);
router.get('/book/:id', bookController.view);
router.post('/book/', bookController.store);
router.put('/book/:id', bookController.update);
router.delete('/book/:id', bookController.destroy);
router.delete('/book', bookController.destroyAllData);

module.exports = router;
