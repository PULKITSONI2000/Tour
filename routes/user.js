const express = require("express");
const router = express.Router();

const {
	getUserById,
	getUser,
	updateUser,
	getUserBooking,
	addUserBooking,
	getUserInbox,
	addUserInbox,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { check, body } = require("express-validator");

// param

router.param("userId", getUserById);

// Get Routes
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// Update User Route
router.put(
	"/user/update/:userId",
	isSignedIn,
	isAuthenticated,
	[
		check("userName", "User Name should be of 3 character").isLength({
			min: 3,
			max: 64,
		}),
		check("firstName", "First Name should be of 3 character").isLength({
			min: 3,
			max: 32,
		}),
		check("lastName", "Last Name should be of 3 character").isLength({
			min: 2,
			max: 32,
		}),
		check("userAvatarUrl", "userAvatarUrl should be a url").isURL().isLength({
			min: 3,
		}),
		check("password", "Password can not be update here").isLength({
			max: 0,
		}),
		check("gender", "Gender should be at Most 8 char and String")
			.isString()
			.isLength({
				max: 8,
				min: 4,
			}),

		check("dob", "Date of Birth should be in date format").trim().isDate(),
		check("email", "Email is required").isEmail().normalizeEmail(),
		check(
			"phone",
			"Phone Number should be valid Mobile Number"
		).isMobilePhone(),
		check("address", "houseNo should be less then 20 character").isLength({
			min: 3,
			max: 128,
		}),
		check("city", "city should be String").isString().isLength({
			min: 2,
			max: 32,
		}),
		check("state", "state should be String").isString().isLength({
			min: 2,
			max: 32,
		}),
		check("country", "state should be String").isString().isLength({
			min: 2,
			max: 32,
		}),
	],
	updateUser
);

// Booking
//  TODO: Test both

// Get User bookingHistory
router.get(
	"/user/booking/:userId",
	isSignedIn,
	isAuthenticated,
	getUserBooking
);

// Add Booking to bookingHistory
router.post(
	"/user/booking/add/:userId",
	isSignedIn,
	isAuthenticated,
	[check("booking", "Product Id should be Id").isUUID()],
	// TODO: create boolong midelware
	addUserBooking
);

// inboxNotification

// Get Notification
router.get("/user/inbox/:userId", isSignedIn, isAuthenticated, getUserInbox);

//Add User Notification
router.post(
	"/user/inbox/notify/:userId",
	isSignedIn,
	// isAdmin,
	[
		check(
			"title",
			"Title should be String and in Between 8-256 Char. "
		).isLength({
			max: 256,
			min: 8,
		}),
		check(
			"message",
			"Message should be String and in Between 3-200 Char. "
		).isLength({
			max: 1024,
			min: 8,
		}),
		body("userId").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("User Id should be Id");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	addUserInbox
);

module.exports = router;
