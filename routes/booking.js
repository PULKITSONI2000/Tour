const express = require("express");
const { check, body } = require("express-validator");
const { getBookingById, createBooking } = require("../controllers/booking");
const { updateNoOfBooking } = require("../controllers/tour");
const { addUserBooking } = require("../controllers/user");
const router = express.Router();

// params
router.param("bookingId", getBookingById);

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
		check("startingDate", "Date of Birth should be in date format")
			.trim()
			.isDate(),
		check("endingDate", "Date of Birth should be in date format")
			.trim()
			.isDate(),
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
// get a order
router.get("/order/:userId", isSignedIn, isAuthenticated, getOrder);

// get All order
router.get(
	"/order/all/:userId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getAllOrders
);

// Get status of order
router.get(
	"/order/status/:userId",
	isSignedIn,
	isAuthenticated,
	getOrderStatus
);
// update Status of order
router.put(
	"/order/:orderId/status/:sellerId",
	isSignedIn,
	isAuthenticated,
	isSellerVarified,
	updateStatus
);

module.exports = router;
