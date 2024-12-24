const express = require('express');
const router = express.Router();
const RoleController = require('../Controllers/role.controller');
const { authJwt } = require('../Middleware/apiAuth.middleware');

router.get('/', authJwt, RoleController.getRoleById).post('/', authJwt, RoleController.createRole);

module.exports = router;
