
class Location {
    constructor(address, id) {
        this.address = address;
        this._id = id ? new ObjectId(id) : null;
    }
}

module.exports = Location;
