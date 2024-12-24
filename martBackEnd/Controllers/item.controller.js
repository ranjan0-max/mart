const Item = require('../Database/Models/item.model');
const Logger = require('../Helpers/logger');
const Response = require('../Helpers/response.helper');
const DateTime = require('../Helpers/dateTime.helper');
const DB = require('../Helpers/crud.helper');
const controllerName = 'item.controller.js';

const createItem = async (req, res) => {
    try {
        let data = {
            ...req.body
        };
        data.name = data.name.toLowerCase();
        await DB.create(Item, data);

        return Response.success(res, {
            data: {},
            message: 'Item Created SuccessFully'
        });
    } catch (error) {
        Logger.error(error.message + 'at createItem function ' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

const updateItem = async (req, res) => {
    try {
        const myquery = { _id: req.params.id };
        const data = {
            ...req.body,
            updatedAt: DateTime.IST('date')
        };
        await DB.update(Item, { data, query: myquery });
        return Response.success(res, {
            data: {},
            message: 'Item Updated SuccessFully'
        });
    } catch (error) {
        Logger.error(error.message + 'at updateItem function' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

const getAllItemList = async (req, res) => {
    try {
        const itemList = await DB.findDetails(Item, req.query);
        return Response.success(res, {
            data: itemList,
            message: 'Item List Found'
        });
    } catch (error) {
        Logger.error(error.message + 'at getAllItemList function' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

module.exports = {
    createItem,
    updateItem,
    getAllItemList
};
