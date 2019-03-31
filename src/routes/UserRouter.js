var express = require('express');
var router = express.Router();
var userController = require('../controller/UserController');
var verification = require('../util/verification');

router.post('/create', userController.create);
router.put('/update', verification.verifyToken, userController.update);
router.get('/get/:id', verification.verifyToken, userController.getById);
router.get('/all', verification.verifyToken, userController.getAll);
router.put('/make-admin', verification.verifyToken, userController.makeAdmin);
router.delete('/remove/:id', verification.verifyToken, userController.remove);
router.get('/check/:email', userController.checkEmail);

router.post('/login', userController.login);
router.post('/admin/login', userController.adminLogin);

module.exports = router;