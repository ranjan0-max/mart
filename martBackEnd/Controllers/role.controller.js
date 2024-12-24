const Role = require('../Database/Models/role.model');

const Logger = require('../Helpers/logger');
const Response = require('../Helpers/response.helper');
const DB = require('../Helpers/crud.helper');
const controllerName = 'role.controller.js';

// -==-=-=-=-=-=-=-=-=-=-==-= get role by id -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const getRoleById = async (req, res) => {
    try {
        const role = await DB.readOne(Role, req.query);
        return Response.success(res, {
            data: role,
            message: 'Role Found'
        });
    } catch (error) {
        Logger.error(error.message + 'at getRoleById function' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

// -==-=-=-=-=-=-=-=-=-=-==-= create role -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const createRole = async (req, res) => {
    try {
        const role = await DB.create(Role, req.body);
        return Response.success(res, {
            data: role,
            message: 'Role Created'
        });
    } catch (error) {
        Logger.error(error.message + 'at createRole function' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

module.exports = {
    getRoleById,
    createRole
};
