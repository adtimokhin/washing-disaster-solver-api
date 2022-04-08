const fs = require("fs");
const ini = require("ini");

module.exports.generateJWTSecret = (length = 35) => { // code by https://stackoverflow.com/users/164392/csharptest-net
  var token = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return token;
};
