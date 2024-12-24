const express = require('express');
const AuthController = require('../Controllers/auth.controller');
const Validator = require('../Middleware/validator.middleware');
const { authJwt, authorize } = require('../Middleware/apiAuth.middleware');

const router = express.Router();

router
    .get('/', AuthController.generateTokens)
    .get('/logout', authJwt, AuthController.logout)
    .post('/login', Validator('loginValidator'), AuthController.login)
    // .post("/register", Validator("registerValidator"), authJwt, authorize(["SUPER_ADMIN", "ADMIN"]), AuthController.register)
    .get('/user', authJwt, AuthController.getUser);

module.exports = router;
