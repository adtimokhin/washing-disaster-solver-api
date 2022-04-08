const express = require("express");
const fs = require("fs");
const ini = require("ini"); // library to work with .ini files link: https://github.com/npm/ini
const bodyParser = require("body-parser");

const app = express();

const database = require("./utils/databse.js");

// Routes
const locationRoute = require("./routes/location.js");

// Creating a new JWT secret to use before the launch of the application.
const config = ini.parse(fs.readFileSync("./properties/config.ini", "utf-8")); // opening connection with a file that constains configuartion information.
const generateJWTSecret = require("./utils/jwt-security.js").generateJWTSecret;
config.jwt.secret = generateJWTSecret();
fs.writeFileSync("./properties/config.ini", ini.stringify(config));

// Setting deault settings for the routes in the application
app.use(bodyParser.json())

// Setting the routes
app
  .use(config.default.apiRoute, locationRoute);

// Connecting to the database and then launching the application.
database.mongoConnect(() => {
  app.listen(config.default.port);
});
