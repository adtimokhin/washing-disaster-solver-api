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
    .then((location) => {
      if (!location) {
        const err = new Error("No location was found using the id passed");
        err.statusCode = 422;
        throw err;
      }
      machine = new Machine(type, name, timeStart, timeEnd, null, locationId);
      return MachineService.saveMachine(machine);
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

  const locationId = req.params.locationId;
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

// Method will take in the object, the corresponding field and it will throw a 422 error if the new value matches the one stored.
function updateField(object, propertyName, newValue) {
  if (newValue) {
    if (object[propertyName] === newValue) {
      const err = new Error(
        `Updated value for field of ${propertyName} matches the one stored in the database.`
      );
      err.statusCode = 422;
      throw err;
    }

    object[propertyName] = newValue;
  }
}

// Updates machie by its id.
module.exports.patchMachine = (req, res, next) => {
  checkForValidationErrors(req, "Invalid input.");

  MachineService.findMachineById(req.body.machineId)
    .then((machine) => {
      if (!machine) {
        const err = new Error("No machine was found using this id.");
        err.statusCode = 422;
        throw err;
      }

      if (req.body.type) {
        if (["washing", "drying"].includes(req.body.type)) {
          machine.type = req.body.type;
        } else {
          const err = new Error(
            "Type of machine should be either washing or drying."
          );
          err.statusCode = 422;

          throw err;
        }
      }

      updateField(machine, "name", req.body.name);
      updateField(machine, "timeStart", req.body.timeStart);
      updateField(machine, "timeEnd", req.body.timeEnd);
      updateField(machine, "locationId", req.body.locationId);

      if (req.body.locationId) {

        LocationService.findLocationById(machine.locationId)
          .then((location) => {
            if (!location) {
              const err = new Error(
                "No location was found using the id passed"
              );
              err.statusCode = 422;
              throw err;
            }

            return MachineService.updateMachine(machine);
          })
          .then((_) => {
            const response = new Response(204);
            res.status(response.statusCode).json(response);
          })
          .catch((err) => {
            next(err);
          });
      } else {
        MachineService.updateMachine(machine)
          .then((_) => {
            const response = new Response(204);
            res.status(response.statusCode).json(response);
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};
