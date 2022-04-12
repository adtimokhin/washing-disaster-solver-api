const express = require("express");
const router = express.Router();

const bookingStatus = require("../models/booking.js").status;

const { body, param } = require("express-validator");

const MachineService = require("../services/machine.js");
const controller = require("../controllers/booking.js");


// all of the routes that are related to location.
router.get(
  "/active-bookings/:machineId",
  [
    param("machineId").not().isEmpty().withMessage("Must be speicified"),
    body("status")
      .isIn(bookingStatus)
      .withMessage(`Must be set to one of ${bookingStatus}`),
  ],
  controller.getBookingsByMachineIdAndStatus
);

router.get(
  "/bookings/:machineId",
  [param("machineId").not().isEmpty().withMessage("Must be speicified")],
  controller.getBookingsByMachineid
);

router.post(
  "/booking",
  [
    body("machineId").custom((value, { req }) => {
      return MachineService.findMachineById(value).then((machine) => {
        if (!machine) {
          return Promise.reject("Machine is not found");
        }
      });
    }),

    // TODO: Add validations for time.
  ],
  controller.postBooking
);

router.patch(
  "/booking",
  [body("bookingId").not().isEmpty().withMessage("BookingId cannot be empty")],
  controller.patchBooking
);

router.delete(
  "/booking/:bookingId",
  [param("bookingId").not().isEmpty().withMessage("BookingId cannot be empty")],
  controller.deleteBooking
);

module.exports = router;
