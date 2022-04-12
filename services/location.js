const ObjectId = require("mongodb").ObjectId;
const getDb = require("../utils/databse.js").getDb;

// Saves location object into the database
module.exports.saveLocation = (location) => {
  return getDb().collection("locations").insertOne(location);
};

// Finds location by _id field
module.exports.findLocationById = (locationId) => {
  return getDb()
    .collection("locations")
    .findOne({ _id: new ObjectId(locationId) });
};

// Updates location in the database if it exists
module.exports.updateLocation = (location) => {
  if (!location._id) {
    throw new Error("Undefined location. Could not resolve its id.");
  }
  return getDb()
    .collection("locations")
    .updateOne({ _id: new ObjectId(location._id) }, { $set: location });
};

// Deletes location from the databse if it exists
module.exports.deleteLocationById = (locationId) => {
  // locationId is a String, not ObjectId object
  return getDb()
    .collection("locations")
    .deleteOne({ _id: new ObjectId(locationId) });
};
