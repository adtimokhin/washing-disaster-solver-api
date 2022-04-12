const ObjectId = require("mongodb").ObjectId;

const status = ["pending", "waiting to start", "active", "finished", "cancelled"];

class Booking {
  constructor(machineId, timeStart, timeEnd, status, userId, id) {
    this.machineId = machineId;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this.status = status;
    this.userId = userId;
    this._id = id ? new ObjectId(id) : null;
  }
}

module.exports.Booking = Booking;
module.exports.status = status;
