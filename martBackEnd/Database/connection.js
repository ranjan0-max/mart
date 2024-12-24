const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const { DATABASE_URI_PROD, DATABASE_URI_DEV, NODE_ENV } = process.env;

let DATABASE_URI;

if (NODE_ENV === "production") DATABASE_URI = DATABASE_URI_PROD;
else DATABASE_URI = DATABASE_URI_DEV;

module.exports = {
  connection: () => mongoose.connect(DATABASE_URI),
};
