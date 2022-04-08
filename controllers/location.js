const LocationService = require("../services/location.js");
const Location = require("../models/location.js");
const Response = require("../utils/response.js");

const { validationResult } = require("express-validator");

// Checks whether there are errors detected by the middleware. If yes, this method will also throw an error.
const checkForValidationErrors = (req, errorMessage) => {
  const errors = validationResult(req);

  if (!errors.isEmpty) {
    const err = new Error(errorMessage);
    err.statusCode = 422;
    err.data = errors.array();

    throw err;
  }
};

module.exports.getLocationById = (req, res, next) => {
  checkForValidationErrors(req, "Require an id.");

  const locationId = req.params.locationId;
  LocationService.findLocationById(locationId)
    .then((location) => {
      const response = new Response(200, "Location was found", {
        location: { address: location.address },
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      err.message = "Could not find the location by id.";
      next(err);
    });
};

module.exports.postLocation = (req, res, next) => {
  checkForValidationErrors(req, "Cannot parse input.");

  const address = req.body.address; // todo: add middleware functions that check the passed input.
  LocationService.saveLocation(new Location(address))
    .then((location) => {
      const response = new Response(201, "Location was added to the database", {
        location: { _id: location.insertedId },
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.patchLocation = (req, res, next) => {
  // todo: Add roles. Make it so that only owners of the locations can update and delete them
  checkForValidationErrors(req, "Invalid input.");

  const locationId = req.body._id;
  const address = req.body.address;

  const location = new Location(address, locationId);

  LocationService.updateLocation(location)
    .then((_) => {
      const response = new Response(204);
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteLocationById = (req, res, next) => {
  // todo: Add roles. Make it so that only owners of the locations can update and delete them
  checkForValidationErrors(req, "Require an id.");

  const locationId = req.params.locationId; // todo: add a middleware that checks for this things.

  LocationService.deleteLocationById(locationId)
    .then((_) => {
      const response = new Response(204);
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};
