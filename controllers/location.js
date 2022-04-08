const LocationService = require("../services/location.js");
const Location = require("../models/location.js");
const Resopnse = require("../utils/response.js");

module.exports.getLocationById = (req, res, next) => {
  const locationId = req.params.locationId;
  LocationService.findLocationById(locationId)
    .then((location) => {
      const response = new Resopnse(200, "Location was found", {
        location: { address: location.address },
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      console.log("err :>> ", err);
      next(); // todo: make a special route that handles errors.
    });
};

module.exports.postLocation = (req, res, next) => {
  const address = req.body.address; // todo: add middleware functions that check the passed input.
  LocationService.saveLocation(new Location(address))
    .then((location) => {
      const response = new Resopnse(201, "Location was added to the database", {
        location: {_id: location.insertedId},
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

