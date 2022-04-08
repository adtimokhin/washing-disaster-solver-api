const ObjectId = require("mongodb").ObjectId;

const generateToken = require("../utils/token-generator.js").generateToken;

class User {
  constructor(email, password, name, id) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.verified = false;
    this.emailVerification = new UserToken(generateToken())
    this._id = id ? new ObjectId(id) : null;
  }
}

class UserToken {
  constructor(tokenValue) {
    this.tokenValue = tokenValue
    this.created = new Date();
  }
}

module.exports.User = User;
module.exports.UserToken = UserToken;
