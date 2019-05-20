var express = require('express');
var router = express.Router();
var categoryController = require('../controller/CategoryController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, categoryController.create);
router.put('/update', verification.verifyToken, categoryController.update);
router.get('/all', categoryController.getAll);
router.get('/get/:id', categoryController.getById);
router.delete('/remove/:id', verification.verifyToken, categoryController.remove);

module.exports = router;