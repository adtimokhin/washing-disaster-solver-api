const ObjectId = require("mongodb").ObjectId;

class Machine {
  constructor(type, name, timeStart, timeEnd, id, locationId) {
    this.type = type;
    this.name = name;
    this.locationId = locationId;
    this.timeStart = timeStart;
    this.timeEnd = timeEnd;
    this._id = id ? new ObjectId(id) : null;
  }
}

module.exports = Machine;
