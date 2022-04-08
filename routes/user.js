const express = require("express");
const router = express.Router();

const UserService = require("../services/user.js");

const { body, param } = require("express-validator");

const controller = require("../controllers/user.js");

// all of the routes that are related to location.
router.put(
  // does all of the checks of the data from the request.
  "/sign-up",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom((value, { req }) => {
        return UserService.findUserByEmail(value).then((user) => {
          if (user) {
            return Promise.reject("User with this email already exists");
          }
        });
      }),
    body("password")
      .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
      .withMessage(
        "Password should contain letters, capital and regular, numbers and specail symbols. The length of the password should be 8 or more characters."
      )
      .custom((value, { req }) => {
        if (value !== req.body.checkPassword) {
          throw new Error("Passwords should match.");
        } else {
          return value;
        }
      }),
    body("name")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Name should be at least 5 characters long."),
  ],
  controller.postSignUp
);

router.get(
  "/login",
  [
    body("email").not().isEmpty().withMessage("Email should be specified"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("Password should be specified"),
  ],
  controller.getLogin
);

router.put(
  "/user/verified/:token",
  [param("token").not().isEmpty().withMessage("Token must be specified")],
  controller.putVerificationStatus
);

router.put(
  "/password-token",
  [body("email").not().isEmpty().withMessage("Email must be specified.")],
  controller.putPassswordUpdateVerificationToken
);

router.put(
  "/password/:token",
  [
    param("token").not().isEmpty().withMessage("Token must not be empty"),
    body("password")
      .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
      .withMessage(
        "Password should contain letters, capital and regular, numbers and specail symbols. The length of the password should be 8 or more characters."
      )
      .custom((value, { req }) => {
        if (value !== req.body.checkPassword) {
          throw new Error("Passwords should match.");
        } else {
          return value;
        }
      }),
  ],
  controller.putPassswordUpdate
);


module.exports = router;
