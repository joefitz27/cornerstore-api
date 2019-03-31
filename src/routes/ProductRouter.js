var express = require('express');
var router = express.Router();
var productController = require('../controller/ProductController');
var verification = require('../util/verification');

router.post('/create', verification.verifyToken, productController.create);
router.get('/all', productController.getAll);
router.get('/search/:searchText', productController.search);

module.exports = router;