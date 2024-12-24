const mongoose = require("mongoose");
require("dotenv").config();

const { connection } = require("../connection");

const Role = require("../Models/role.model");
const { IST } = require("../../Helpers/dateTime.helper");


const seeder = {
    role: async () => {
        const data = [
            {
                role: "SUPER_ADMIN",
                role_active: true,
                created_at: IST(),
                updated_at: IST()
            },
            {
                role: "ADMIN",
                role_active: true,
                created_at: IST(),
                updated_at: IST()
            },
            {
                role: "USER",
                role_active: true,
                created_at: IST(),
                updated_at: IST()
            }
        ];

        return new Promise(async (resolve, reject) => {
            Role.insertMany(data, (error, docs) => {
                if (error) reject(error);
                else resolve("DB seed complete");
            });
        });
    },
}

const init = async (seeder) => {
    try {
        await connection();
        
        console.log("Checking seeder !");
        let seedName = process.argv[2];
        if (seedName in seeder) {
            console.log("Seeder found :)");
            console.log("Running seeder...");
            await seeder[seedName]();
            process.exit();
        }
        else console.log(`Please provide an existing seeder name, seeder ${seedName} does not exist`);
    } catch (error) {
        console.log("Error seeding DB :: ", error?.message);
        process.exit();
    } 
};

init(seeder);
// seeder command => ```npm run seed -- seeder_name```
// seeder command => ```npm run seed -- role```  for role seeder