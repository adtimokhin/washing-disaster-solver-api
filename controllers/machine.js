const MachineService = require("../services/machine.js");
const Machine = require("../models/machine.js");
const Response = require("../utils/response.js");

const LocationService = require("../services/location.js");

const checkForValidationErrors = require("../utils/validtion-success-check.js");

// Adds a new machine to the system. Also checks whether the locationId is identifying an existing Location.
module.exports.postMachine = (req, res, next) => {
  checkForValidationErrors(req, "Cannot parse input.");

  const type = req.body.type;
  const name = req.body.name;
  const locationId = req.body.locationId;
  const timeStart = req.body.timeStart;
  const timeEnd = req.body.timeEnd;

  let machine;
  LocationService.findLocationById(locationId)
    .then((_) => {
      machine = new Machine(type, name, locationId, timeStart, timeEnd);
      MachineService.saveMachine(machine);
    })
    .then((result) => {
      const response = new Response(201, "Machine was added to the database", {
        machine: { _id: result.insertedId, ...machine },
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// Finds the machine by Id.
module.exports.getMachineById = (req, res, next) => {
  checkForValidationErrors(req, "Cannot parse input.");

  const machineId = req.param.machineId;

  MachineService.findMachineById(machineId)
    .then((machine) => {
      const response = new Response(200, "Machine was found", {
        machine: { ...machine },
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      err.message = "Could not find the location by id.";
      next(err);
    });
};

// Finds all machines by a location id.
module.exports.getMachinesByLocationId = (req, res, next) => {
  checkForValidationErrors(req, "Location id must be set.");

  const locationId = req.param.locationId;

  MachineService.findMachinesByLocationId(locationId)
    .then((machines) => {
      const response = new Response(200, "Machines were found", {
        machines: [...machines],
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// Deletes machine by its id.
module.exports.deleteMachineById = (req, res, next) => {
  checkForValidationErrors(req, "Require an id.");

  const machineId = req.params.machineId;

  MachineService.deleteMachineById(machineId)
    .then((_) => {
      const response = new Response(204);
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// Updates machie by its id.
module.exports.patchMachine = (req, res, next) => {
  checkForValidationErrors(req, "Invalid input.");

  const machineId = req.body.machineId;
  const type = req.body.type;
  const name = req.body.name;
  const locationId = req.body.locationId;
  const timeStart = req.body.timeStart;
  const timeEnd = req.body.timeEnd;

  const machine = new Machine(
    type,
    name,
    locationId,
    timeStart,
    timeEnd,
    machineId
  );

  MachineService.updateMachine(machine)
    .then((_) => {
      const response = new Response(204);
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};
