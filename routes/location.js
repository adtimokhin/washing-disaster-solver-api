const express = require("express");
const router = express.Router();

const controller = require("../controllers/location.js");

// all of the routes that are related to location.
router.get("/location/:locationId", controller.getLocationById);
router.post("/location", controller.postLocation);
router.patch("/location", controller.patchLocation);
router.delete("/location/:locationId", controller.deleteLocationById);

module.exports = router;
