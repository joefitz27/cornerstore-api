var express = require('express');
var router = express.Router();
var storeController = require('../controller/StoreController');
var verification = require('../util/verification');

router.post('/create', storeController.create);
router.put('/update', verification.verifyToken, storeController.update);
router.get('/all', storeController.getAll);
router.get('/get/:id', storeController.getById);
router.get('/get/user/:id', storeController.getByUserId);
router.delete('/remove/:id', verification.verifyToken, storeController.remove);

module.exports = router;