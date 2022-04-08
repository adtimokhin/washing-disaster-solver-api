const express = require("express");
const router = express.Router();

const { body, param } = require("express-validator");

const controller = require("../controllers/location.js");

// all of the routes that are related to location.
router.get(
  "/location/:locationId",
  [
    param("locationId")
      .not()
      .isEmpty()
      .withMessage("No Id of location is entered"),
  ],
  controller.getLocationById
);

router.post(
  "/location",
  [body("address").not().isEmpty().withMessage("Empty address field.")],
  controller.postLocation
);

router.patch(
  "/location",
  [
    body("_id").not().isEmpty().withMessage("Empty Field"),
    body("address").not().isEmpty().withMessage("Empty Field"),
  ],
  controller.patchLocation
);

router.delete(
  "/location/:locationId",
  [
    param("locationId")
      .not()
      .isEmpty()
      .withMessage("No Id of location is entered"),
  ],
  controller.deleteLocationById
);

module.exports = router;
