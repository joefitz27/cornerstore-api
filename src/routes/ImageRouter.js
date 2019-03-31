var express = require('express');
var router = express.Router();

var imageController = require('../controller/ImageController');
var verification = require('../util/verification');

router.post('/upload/image/:id', verification.verifyToken, imageController.upload);
router.get('/get/image/:id', verification.verifyToken, imageController.getImage);
router.delete('/delete/image/:id', verification.verifyToken, imageController.deleteImage);

module.exports = router;