const bookingStatus = require("../../models/booking.js").status;

module.exports.getBookingUpdatedStatus = (booking) => {
  // If the booking has begun the status must be set to "active"
  // If the boooking has finished the status must be set to "finished"
  // Method should return boolean value that tells if there was a change in state.

  return true;
  //TODO: make this method!
};


// This method will check whether a booking can be made for the time slot that the booking is set to. This method takes an addtiotional parameter - updating.
//  If it is true the method will ignore the booking for the methodd passed, so it can be rescheduled in an appropriate fashion.
module.exports.isValidTimeSlot = (machine) => {
    // Make this method collect all incoming requests in a queue so that we do not end up with bookings for the same time.
    return true; // TODO: make this method!
  };