const express = require('express');
const UserController = require('../Controllers/user.controller');
const router = express.Router();
const { authJwt, authorize } = require('../Middleware/apiAuth.middleware');

router
    .post('/', authJwt, UserController.createUser)
    .put('/:id', authJwt, UserController.updateUser)
    .get('/', authJwt, UserController.getAllUser);

module.exports = router;
