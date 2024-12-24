require('dotenv').config();
const DB = require('../../Helpers/crud.helper');
const User = require('../Models/user.model');
const { connection } = require('../connection');
const { IST } = require('../../Helpers/dateTime.helper');

const AuthHelper = require('../../Helpers/auth.helper');
const Logger = require('../../Helpers/logger');
const Role = require('../Models/role.model');
// seeder data here

const data = [
    {
        name: 'SUPERADMIN',
        email: 'superadmin@gmail.com',
        password: 'secret',
        role: '',
        phoneNumber: 9876543210,
        activeStatus: true,
        configStatus: true
    }
];

const init = async (data) => {
    try {
        connection();
        const role = await DB.readOne(Role, { role: 'SUPER_ADMIN' });
        data[0].role = role._id;
        data[0].password = await AuthHelper.generateHash(data[0].password);
        User.deleteMany({}, (error) => {
            if (error) {
                console.log(error);
            }
        });

        await DB.create(User, data[0]);
        process.exit();

        console.log('running seeder !');
    } catch (error) {
        console.log('Error seeding DB :: ', error?.message);
        process.exit();
    }
};

init(data);
