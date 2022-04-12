const BookingService = require("../services/booking.js");
const Booking = require("../models/booking.js").Booking;
const MachineService = require("../services/machine.js");
const bookingStatus = require("../models/booking.js").status;
const Response = require("../utils/response.js");
const updateField = require("../utils/update-field.js");

const bookingChecks = require("../utils/time/booking-validation.js");

const jwtSecurity = require("../utils/jwt-security").getJWTData;

const checkForValidationErrors = require("../utils/validtion-success-check.js");

module.exports.getBookingsByMachineIdAndStatus = (req, res, next) => {
  checkForValidationErrors(req);

  const machineId = req.params.machineId;
  const status = req.body.status;

  BookingService.findBookingsByMachineIdAndStatus(machineId, status)
    .then((bookings) => {
      const data = [];
      if (bookings) {
        data = [...bookings];
      }
      const response = new Response(200, "Bookings were found", {
        machines: data,
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getBookingsByMachineid = (req, res, next) => {
  checkForValidationErrors(req, "Machine id must be set.");

  const machineId = req.params.machineId;
  BookingService.findBookingsByMachineId(machineId)
    .then((bookings) => {
      const data = [];
      if (bookings) {
        // TODO: Before sending data update statuses.
        data = [...bookings];
      }
      const response = new Response(200, "Bookings were found", {
        machines: data,
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// We assume that this method is only accessible with a valid JWT token.
module.exports.postBooking = (req, res, next) => {
  checkForValidationErrors(req);

  const machineId = req.body.machineId;
  const timeStart = req.body.timeStart;
  const timeEnd = req.body.timeEnd;
  const status = bookingStatus.at(0);
  const token = req.get("Authorization").split(" ")[1];

  if (!token) {
    throw Error("Internal server error");
  }

  const userId = jwtSecurity(token).userId;

  let booking;

  MachineService.findMachineById(machineId)
    .then((machine) => {
      if (!machine) {
        const err = new Error("No machine was found using the id passed.");
        err.statusCode = 422;
        throw err;
      }

      booking = new Booking(machineId, timeStart, timeEnd, status, userId);
      if (!bookingChecks.isValidTimeSlot(booking)) {
        booking.status = bookingStatus.at(1); // setting the status to waiting for execution but valid
        return BookingService.saveBooking(booking);
      }
    })
    .then((result) => {
      const response = new Response(201, "Booking was added to the database", {
        machine: { _id: result.insertedId, ...booking },
      });
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};

// Note: userId is immutable!
// Middleware isAuthor() must be used because only owners of the bookings are allowed to update them.
module.exports.patchBooking = (req, res, next) => {
  checkForValidationErrors(req);

  const bookingId = req.body.bookingId;

  BookingService.findBookingById(bookingId)
    .then((booking) => {
      if (!booking) {
        const err = new Error("No booking was found using this id");
        err.statusCode = 422;
        throw err;
      }

      const token = req.get("Authorization").split(" ")[1];

      if (booking.userId !== jwtSecurity(token)) {
        const err = new Error("You are not the owner of this booking");
        err.status = 403;
        throw err;
      }

      if (booking.status === bookingStatus[-1]) {
        const err = new Error(
          "Booking cannot be moddified - it has been cancelled."
        );
        err.statusCode = 422;
        throw err;
      }

      if (
        updateField(booking, "timeStart", req.body.timeStart) ||
        updateField(booking, "timeEnd", req.body.timeEnd)
      ) {
        // If one of this fields has been changed we need to find if the booking is valid for the time passed.

        if (!bookingChecks.isValidTimeSlot(booking, true)) {
          const err = new Error("This time slot is unavalibale"); // TODO: Update the isValidTimeSlot() method to return a list of problems identified.
          err.statusCode = 422;
          throw err;
        }
      }
      const status = req.body.status;
      if (status) {
        if (status === bookingStatus[-1]) {
          booking.type = status;
        } else {
          const err = new Error(
            "Booking status can only be updated to cancelled"
          );
          err.statusCode = 422;

          throw err;
        }
      }

      const machineId = req.body.machineId;
      if (machineId) {
        MachineService.findMachineById(machineId)
          .then((machine) => {
            if (!machine) {
              const err = new Error("No machine was found using this id");
              err.statusCode = 422;
              throw err;
            }

            booking.machineId = machineId;
            return BookingService.updateBooking(booking);
          })
          .then((_) => {
            const response = new Response(204);
            res.status(response.statusCode).json(response);
          })
          .catch((err) => {
            next(err);
          });
      } else {
        BookingService.updateBooking(booking)
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

module.exports.deleteBooking = (req, res, next) => {
  checkForValidationErrors(req, "Require an id.");

  const bookingId = req.params.bookingId;

  BookingService.deleteBookingById(bookingId)
    .then((_) => {
      const response = new Response(204);
      res.status(response.statusCode).json(response);
    })
    .catch((err) => {
      next(err);
    });
};
