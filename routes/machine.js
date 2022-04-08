const express = require("express");
const router = express.Router();

const { body, param } = require("express-validator");

const controller = require("../controllers/machine.js");

// all of the routes that are related to location.
// Finds Machine by its id.
router.get(
  "/machine/:machineId",
  [
    param("machineId")
      .not()
      .isEmpty()
      .withMessage("No Id of machine is entered"),
  ],
  controller.getMachineById
);

// Adds Machine to the database.
router.post(
  "/machine",
  [
    body("type")
      .isIn(["washing", "drying"])
      .withMessage(
        'Currently two machine types are supported: "washing" and "drying"'
      ),

    body("name").not().isEmpty().withMessage("Name cannot be empty"),

    body("locationId")
      .not()
      .isEmpty()
      .withMessage("Location Id cannot be empty"),

    body("timeStart").isDate(),
    body("timeEnd").isDate(),
  ],
  controller.postMachine
);

// Finds all machines with a certain locationId
router.get(
  "/machines/:locationId",
  [
    param("locationId")
      .not()
      .isEmpty()
      .withMessage("Location Id cannot be empty"),
  ],
  controller.getMachinesByLocationId
);

// Updates machine's content.
router.patch(
  "/machine",
  [
    body("machieId").not().isEmpty().withMessage("Id cannot be empty."),
    body("type")
      .isIn(["washing", "drying"])
      .withMessage(
        'Currently two machine types are supported: "washing" and "drying"'
      ),

    body("name").not().isEmpty().withMessage("Name cannot be empty"),

    body("locationId")
      .not()
      .isEmpty()
      .withMessage("Location Id cannot be empty"),

    body("timeStart").isDate(),
    body("timeEnd").isDate(),
  ],
  controller.patchMachine
);

// Deletes machine, finding it by Id passed as a string.
router.delete(
  "/machine/:machineId",
  [body("machieId").not().isEmpty().withMessage("Id cannot be empty.")],
  controller.deleteMachineById
);

module.exports = router;