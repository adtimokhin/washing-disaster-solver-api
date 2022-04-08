const UserService = require("../services/user.js");
const User = require("../models/user.js").User;
const UserToken = require("../models/user.js").UserToken;

const checkForValidationErrors = require("../utils/validtion-success-check.js");

const getJWTSecret = require("../utils/jwt-security.js").getJWTSecret;
const generateToken = require("../utils/token-generator.js").generateToken;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const fs = require("fs");
const ini = require("ini"); // library to work with .ini files link: https://github.com/npm/ini

const Response = require("../utils/response.js");

const isTokenExpired = (oldDate) => {
  const timeNow = new Date().getTime();
  const timeCreated = oldDate;
  const timeDiff = timeNow - timeCreated;

  const config = ini.parse(fs.readFileSync("./properties/config.ini", "utf-8")); // opening connection with a file that constains configuartion information.

  return timeDiff > config.user.tokenLifespan;
};

// Adds the user to the databse. This method will encrypt the password. This method assusmes that all appropriate validdations are carried out by the middleware.
module.exports.postSignUp = (req, res, next) => {
  checkForValidationErrors(req, "Invalid data is inputted.");

  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  bcrypt
    .hash(password, 12)
    .then((encryptedPassword) => {
      const user = new User(email, encryptedPassword, name);
      return UserService.saveUser(user);
    })
    .then((result) => {
      const response = new Response(201, "New user was added to the database", {
        user: { _id: result.insertedId },
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// Returns a JWT token if the user is permitted to log in to the application.
module.exports.getLogin = (req, res, next) => {
  checkForValidationErrors(req, "Invalid data is inputted.");

  const email = req.body.email;
  const password = req.body.password;

  let fetchedUser;

  UserService.findUserByEmail(email)
    .then((user) => {
      if (!user) {
        const err = new Error("Invalid credentials.");
        err.statusCode = 401;
        throw err;
      }

      fetchedUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((match) => {
      if (!match) {
        const err = new Error("Invalid credentials.");
        err.statusCode = 401;
        throw err;
      }

      if (false === fetchedUser.verified) {
        const err = new Error("Must verify email first.");
        err.statusCode = 422;
        throw err;
      }

      // return to the user a JWT token if validations have been successful.
      const token = jwt.sign(
        {
          userid: fetchedUser._id,
        },
        getJWTSecret(),
        { expiresIn: "1h" }
      );

      // todo: add sending email with verification token

      const response = new Response(200, "User was verified", {
        token: token,
        userId: fetchedUser._id,
      });

      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// This method will update user's verification status (remove the correcsponding field form the object) if the email token passed matches the one that was setted when the userr was added to the database
module.exports.putVerificationStatus = (req, res, next) => {
  checkForValidationErrors(req, "Invalid data is inputted.");

  const token = req.params.token;

  UserService.findByEmailVerificationToken(token)
    .then((user) => {
      if (!user) {
        const err = new Error("Invalid token.");
        err.statusCode = 401;
        throw err;
      }

      let updatedUser = {};

      updatedUser._id = user._id;
      updatedUser.email = user.email;
      updatedUser.password = user.password;
      updatedUser.name = user.name;
      updatedUser.bookings = [];

      return UserService.replaceUser(updatedUser);
    })
    .then((_) => {
      const response = new Response(204, "User was verificated");

      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// This method will set a new password verification token if none was set or if the token has expired. If the token is still valid an error would be thrown.
module.exports.putPassswordUpdateVerificationToken = (req, res, next) => {
  checkForValidationErrors(req, "Email must be provided.");

  const email = req.body.email;

  UserService.findUserByEmail(email)
    .then((user) => {
      if (!user) {
        const err = new Error("No user with such email was foud.");
        err.statusCode = 422;
        throw err;
      }

      if (user.passwordToken) {
        if (isTokenExpired(user.passwordToken.created.getTime())) {
          // If time difference is > 5h
          delete user.passwordToken;
        } else {
          const err = new Error("Token has not yet expired.");
          err.statusCode = 422;
          throw err;
        }
      }

      // assigning a new token.
      const passwordToken = generateToken();
      user.passwordToken = new UserToken(passwordToken);

      return UserService.updateUser(user);
    })
    .then((_) => {
      const response = new Response(
        204,
        "New password verification token was setted."
      );

      // todo: add sending email with verification token

      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// This method will update user's password.
module.exports.putPassswordUpdate = (req, res, next) => {
  checkForValidationErrors(req, "Invalid data is inputted.");

  const token = req.params.token;
  const newPassword = req.body.password;

  let updatedUser = {};
  let fail = false;

  UserService.findUserByPasswordToken(token)
    .then((user) => {
      if (!user) {
        const err = new Error("Invalid token.");
        err.statusCode = 401;
        throw err;
      }

      if (isTokenExpired(user.passwordToken.created)) {
        delete user.passwordToken;
        fail = true;
        return UserService.replaceUser(user);
      }

      updatedUser._id = user._id;
      updatedUser.email = user.email;
      updatedUser.name = user.name;
      updatedUser.bookings = user.bookings;

      return bcrypt.hash(newPassword, 12);
    })
    .then((result) => {
      if (fail) {
        // password verification token has expired.
        const err = new Error("Token has expired.");
        err.statusCode = 402;
        throw err;
      }

      // else, we receive the success of the hashing.
      updatedUser.password = result;
      return UserService.replaceUser(updatedUser);
    })
    .then((_) => {
      const response = new Response(204, "User was verificated");

      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};
