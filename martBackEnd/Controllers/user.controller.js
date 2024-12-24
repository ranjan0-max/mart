const User = require('../Database/Models/user.model');
const Role = require('../Database/Models/role.model');

const Response = require('../Helpers/response.helper');
const Logger = require('../Helpers/logger');
const DateTime = require('../Helpers/dateTime.helper');
const DB = require('../Helpers/crud.helper');
const AuthHelper = require('../Helpers/auth.helper');
const controllerName = 'user.controller.js';

// -=-=-=-=-=-=-=-=-=-=-=-=- create user -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
const createUser = async (req, res, next) => {
    try {
        // checking email is unique
        await DB.isUnique(User, { email: req.body.email });

        const roleId = await DB.readOne(Role, { role: 'SALEMAN' });

        if (req.body.password) {
            const passwordHash = await AuthHelper.generateHash(req.body.password);
            // create user Data
            const data = {
                ...req.body,
                role: roleId._id,
                password: passwordHash,
                created_at: DateTime.IST('date'),
                updated_at: DateTime.IST('date')
            };
            await DB.create(User, data);

            return Response.success(res, {
                data: data,
                message: 'User Created SuccessFully'
            });
        } else {
            return Response.error(res, {
                data: [],
                message: 'Password is required'
            });
        }
    } catch (error) {
        if (error.name === 'NON_UNIQUE') {
            Logger.error(error.message + 'at createUser function ' + controllerName);
            return Response.error(res, {
                data: [],
                message: 'Email already taken'
            });
        }
        Logger.error(error.message + 'at createUser function ' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=- get all user -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const getAllUser = async (req, res, next) => {
    try {
        const query = {
            ...req.query
        };
        const users = await DB.findDetails(User, query);

        return Response.success(res, {
            data: users,
            message: 'Users Found'
        });
    } catch (error) {
        console.log(error);
        Logger.error(error.message + 'at getAllUser function ' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=- update user -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const updateUser = async (req, res, next) => {
    try {
        const myquery = { _id: req.params.id };
        const data = { ...req.body };

        if (req.body.password) {
            data.password = await AuthHelper.generateHash(req.body.password);
        }

        await DB.update(User, { data, query: myquery });
        return Response.success(res, {
            data: data,
            message: 'User Details Updated!'
        });
    } catch (error) {
        Logger.error(error.message + ' at updateUser function ' + controllerName);
        return Response.error(res, {
            data: [],
            message: error.message
        });
    }
};

module.exports = {
    createUser,
    getAllUser,
    updateUser
};
