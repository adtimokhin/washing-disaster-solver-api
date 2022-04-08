const LocationService = require("../services/location.js");
const Location = require("../models/location.js");
const Response = require("../utils/response.js");

module.exports.getLocationById = (req, res, next) => {
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
