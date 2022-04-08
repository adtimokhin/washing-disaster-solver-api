const ObjectId = require("mongodb").ObjectId;

class Machine {
  constructor(type, name, locationId, timeStart, timeEnd, id) {
    this.type = type;
    this.name = name;
    this.locationId = new Object(locationId);
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this._id = id ? new ObjectId(id) : null;
  }
}

module.exports = Machine;
