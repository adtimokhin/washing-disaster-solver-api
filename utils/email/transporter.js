const fs = require("fs");
const ini = require("ini");
const nodemailer = require("nodemailer");

const config = ini.parse(fs.readFileSync("./properties/config.ini", "utf-8"));

const host = config.mail.host;
const port = config.mail.port;
const protocol = config.mail.protocol;
const secure = config.mail.secure;
const username = config.mail.username;
const password = config.mail.password;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  secure: secure,

  auth: {
    user: username,
    pass: password,
  },
});

module.exports.transporter = transporter;
module.exports.username = username;
