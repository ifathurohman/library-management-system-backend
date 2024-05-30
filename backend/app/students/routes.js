const router = require('express').Router();
const studentController = require('./controller');

router.get('/student', studentController.index);
router.get('/student/:id', studentController.view);
router.post('/student/', studentController.store);
router.put('/student/:id', studentController.update);
router.delete('/student/:id', studentController.destroy);
router.delete('/student', studentController.destroyAllData);

module.exports = router;
