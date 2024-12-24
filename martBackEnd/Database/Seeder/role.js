const mongoose = require('mongoose');
require('dotenv').config();
const { IST } = require('../../Helpers/dateTime.helper');
const Role = require('../Models/role.model');
const { connection } = require('../connection');

// seeder data here

const data = [
    {
        role: 'SUPER_ADMIN',
        role_active: true,
        priority: 1
    },
    {
        role: 'CUSTOMER',
        role_active: true,
        priority: 4
    },
    {
        role: 'DRIVER',
        role_active: true,
        priority: 3
    },
    {
        role: 'SALEMAN',
        role_active: true,
        priority: 2
    }
];
const init = async (data) => {
    try {
        console.log('entring in seeder');
        console.log(process.cwd());
        console.log('running seeder !');
        connection();
        Role.deleteMany({}, (error) => {
            if (error) {
                console.log(error);
            }
        });
        console.log('adding seeder record/s !');
        Role.insertMany(data, (error, docs) => {
            if (error) console.log(error);
            else console.log('DB seed complete');
            process.exit();
        });
        console.log('running seeder !');
    } catch (error) {
        console.log('Error seeding DB :: ', error?.message);
        process.exit();
    }
};

init(data);
