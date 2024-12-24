const express = require('express');
const router = express.Router();
const ItemController = require('../Controllers/item.controller');
const { authJwt } = require('../Middleware/apiAuth.middleware');

router
    .get('/', authJwt, ItemController.getAllItemList)
    .patch('/:id', authJwt, ItemController.updateItem)
    .post('/', authJwt, ItemController.createItem);

module.exports = router;
