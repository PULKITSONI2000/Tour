const express = require("express");
const router = express.Router();

const {
	getUserById,
	getUser,
	updateUser,
	getUserBooking,
	getUserInbox,
	addUserInbox,
	updateUserAvatar,
	updateUserPassword,
	checkforUserName,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { check, body } = require("express-validator");
const { getAgencyById } = require("../controllers/agency");

// param

router.param("userId", getUserById);
router.param("agencyId", getAgencyById);

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
		body("userAvatarUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check("password", "Password can not be update here").isLength({
			max: 0,
		}),
		body("gender").custom((value) => {
			if (!value.match(/^(male|female|others)$/gi)) {
				throw new Error(
					`${value} is not a valid format (valid formats are - male, female or others)`
				);
			}

			// Indicates the success of this synchronous custom validator
			return true;
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

// Updete User Avatar
router.put(
	"/user/update/avatar/:userId",
	isSignedIn,
	isAuthenticated,
	[
		body("userAvatarUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	updateUserAvatar
);

// Updete User Password
router.put(
	"/user/update/password/:userId",
	isSignedIn,
	isAuthenticated,
	[
		body("oldPassword").custom((value) => {
			if (
				!(
					/[a-z]/g.test(value) &&
					/[A-Z]/g.test(value) &&
					/[0-9]/g.test(value) &&
					/[!$@#%&*()\-_)\\/?<>]/g.test(value) &&
					value.length > 6
				)
			) {
				throw new Error(
					`oldPassword should contain at least one of all small latter, capital latter, digit, symbole`
				);
			}

			return true;
		}),
		body("newPassword").custom((value) => {
			if (
				!(
					/[a-z]/g.test(value) &&
					/[A-Z]/g.test(value) &&
					/[0-9]/g.test(value) &&
					/[!$@#%&*()\-_)\\/?<>]/g.test(value) &&
					value.length > 6
				)
			) {
				throw new Error(
					`newPassword should contain at least one of all small latter, capital latter, digit, symbole`
				);
			}

			return true;
		}),
	],
	updateUserPassword
);

// check for userName
router.get(
	"/user/check/username/:userId",
	isSignedIn,
	[
		check("userName", "User Name should be of 3 character").isLength({
			min: 3,
			max: 64,
		}),
	],
	checkforUserName
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

// inboxNotification

// Get Notification
router.get("/user/inbox/:userId", isSignedIn, isAuthenticated, getUserInbox);

//Add User Notification
router.post(
	"/user/inbox/notify/:agencyId",
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
				throw new Error("User Id should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	addUserInbox
);

module.exports = router;
