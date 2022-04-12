const express = require("express");
const router = express.Router();

const machineType = require("../models/machine.js").type;

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
      .isIn(machineType)
      .withMessage(
        `Currently two machine types are supported: ${machineType}`
      ),

    body("name").not().isEmpty().withMessage("Name cannot be empty"),

    body("locationId")
      .not()
      .isEmpty()
      .withMessage("Location Id cannot be empty"),

    // todo: add a check for dates.
    body("timeEnd")
      .not()
      .isEmpty()
      .withMessage("This field should not be empty"),
    body("timeStart")
      .not()
      .isEmpty()
      .withMessage("This field should not be empty"),
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
    body("machineId").not().isEmpty().withMessage("Id cannot be empty."),
    // todo: add a check for dates.
  ],
  controller.patchMachine
);

// Deletes machine, finding it by Id passed as a string.
router.delete(
  "/machine/:machineId",
  [param("machineId").not().isEmpty().withMessage("Id cannot be empty.")],
  controller.deleteMachineById
);

module.exports = router;
