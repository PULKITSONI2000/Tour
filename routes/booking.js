const express = require("express");
const { check, body } = require("express-validator");
const {
	addAgencyBooking,
	reduceTotalEarning,
	getAgencyById,
} = require("../controllers/agency");
const {
	isSignedIn,
	isAuthenticated,
	isAgencyVarified,
} = require("../controllers/auth");
const {
	getBookingById,
	createBooking,
	getBooking,
	updateStatus,
	cancelBooking,
} = require("../controllers/booking");
const { updateNoOfBooking } = require("../controllers/tour");
const { addUserBooking, getUserById } = require("../controllers/user");
const router = express.Router();

// params
router.param("bookingId", getBookingById);
router.param("agencyId", getAgencyById);
router.param("userId", getUserById);

// create
router.post(
	"/booking/create/:userId",
	isSignedIn,
	isAuthenticated,
	[
		body("tourId").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("tourId should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("agencyId").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("agencyId should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("tourists").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");
			value.forEach((userId) => {
				if (!checkForMongoDBId.test(userId)) {
					throw new Error(`${userId} should be users ObjectId`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("startingDate").custom((value) => {
			let startingDate = new Date(value);
			let endingDate = new Date(req.body.endingDate);
			if (startingDate === "Invalid Date") {
				throw new Error("Starting Date should be in date format");
			} else {
				if (Date.parse(startingDate) > Date.parse(endingDate)) {
					throw new Error("Starting Date should be smaller then Ending Date");
				}
			}

			return true;
		}),
		body("endingDate").custom((value) => {
			let endingDate = new Date(value);
			let startingDate = new Date(req.body.endingDate);
			if (endingDate === "Invalid Date") {
				throw new Error("Ending Date should be in date format");
			} else {
				if (Date.parse(startingDate) > Date.parse(endingDate)) {
					throw new Error("Ending Date should be Bigger then Starting Date");
				}
			}

			return true;
		}),

		check("status", "You can not define booking Status").isLength({
			max: 0,
		}),
		check("transaction_id", "You can not define transaction_id").isLength({
			max: 0,
		}),
		check("totalAmount", "totalAmount must be a numaric value").isNumeric({
			no_symbols: true,
		}),

		body("bookedOn").custom((value) => {
			let bookingDate = new Date(value);
			let currentDate = new Date();
			if (
				bookingDate == "Invalid Date" ||
				bookingDate.toDateString() !== currentDate.toDateString()
			) {
				throw new Error(`${value} should be in Date Format (eg- 2021-12-31)`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	createBooking,
	addUserBooking,
	updateNoOfBooking,
	addAgencyBooking
);
// get a booking for user
router.get(
	"/user/booking/:userId/:bookingId",
	isSignedIn,
	isAuthenticated,
	getBooking
);
// get a booking for agency
router.get(
	"/agency/booking/:agencyId/:bookingId",
	isSignedIn,
	isAuthenticated,
	getBooking
);

// update Status of order
router.put(
	"/agency/booking/update/status/:agencyId/:bookingId",
	isSignedIn,
	isAuthenticated,
	isAgencyVarified,
	[
		body("status").custom((value) => {
			const checkForStatus = new RegExp(
				"^(Cancelled|Completed|Booked|OnGoing)$"
			);

			if (!checkForStatus.test(value)) {
				throw new Error(
					'Status should be of "Cancelled", "Completed", "Booked", "OnGoing"'
				);
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	updateStatus
);

// cancel Booking
router.post(
	"/user/booking/cancel/:userId/:bookingId",
	isSignedIn,
	isAuthenticated,
	cancelBooking,
	reduceTotalEarning
);

module.exports = router;
