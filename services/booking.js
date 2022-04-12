const ObjectId = require("mongodb").ObjectId;
const getDb = require("../utils/databse.js").getDb;

// machineId - String value, status - string value.
module.exports.findBookingsByMachineIdAndStatus = (machineId, status) => {
  return getDb()
    .collection("bookings")
    .find({ machineId: machineId, status: status })
    .toArray();
};

module.exports.findBookingsByMachineId = (machineId) => {
  return getDb()
    .collection("bookings")
    .find({ machineId: machineId })
    .toArray();
};

// booking is Booking object. Its id may not be specified in the parameters
module.exports.saveBooking = (booking) => {
  return getDb().collection("bookings").insertOne(booking);
};

module.exports.deleteBookingById = (bookingId) => {
  return getDb()
    .collection("bookings")
    .deleteOne({ _id: new ObjectId(bookingId) });
};

// Important that the bookingId is not updated.
module.exports.updateBooking = (booking) => {
  if (!booking._id) {
    throw new Error("Undefined booking. Could not resolve its id.");
  }
  return getDb()
    .collection("bookings")
    .updateOne({ _id: booking._id }, { $set: booking });
};

module.exports.findBookingById = (bookgingId) => {
  return getDb()
    .collection("bookings")
    .findOne({ _id: new ObjectId(bookgingId) });
};
