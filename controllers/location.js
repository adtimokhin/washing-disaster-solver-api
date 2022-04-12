const LocationService = require("../services/location.js");
const Location = require("../models/location.js");
const Response = require("../utils/response.js");

const checkForValidationErrors = require("../utils/validtion-success-check.js");

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
  checkForValidationErrors(req);

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
  checkForValidationErrors(req);

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

  const locationId = req.params.locationId;

  LocationService.deleteLocationById(locationId)
    .then((_) => {
      const response = new Response(204);
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};
