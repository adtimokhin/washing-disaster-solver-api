const Machine = require("../models/machine.js");
const ObjectId = require("mongodb").ObjectId;
const getDb = require("../utils/databse.js").getDb;

module.exports.saveMachine = (machine) => {
  return getDb().collection("machines").insertOne(machine);
};

module.exports.findMachineById = (machineId) => {
  return getDb()
    .collection("machines")
    .findOne({ _id: new ObjectId(machineId) });
};

module.exports.deleteMachineById = (machineId) => {
  return getDb()
    .collection("machines")
    .deleteOne({ _id: new ObjectId(machineId) });
};

module.exports.findMachinesByLocationId = (locationId) => {
  return getDb()
    .collection("machines")
    .find({ locationId: new ObjectId(locationId) })
    .toArray();
};

// Important that the machine id is not updated
module.exports.updateMachine = (machine) => {
  if (!machine._id) {
    throw new Error("Undefined machine. Could not resolve its id.");
  }
  return getDb()
    .collection("machines")
    .updateOne({ _id: new ObjectId(machine._id) }, { $set: machine });
};
