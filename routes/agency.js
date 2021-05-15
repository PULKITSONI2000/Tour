const express = require("express");
const router = express.Router();

const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
	isAgencyVarified,
} = require("../controllers/auth");

const { check, body } = require("express-validator");
const {
	getAgencyById,
	getAgency,
	getAllAgencies,
	updateAgency,
	updateAgencyPassword,
	getAgencyInbox,
	addAgencyInbox,
	updateAgencyAvatar,
	getAgencyCertificates,
	removeAgencyCertification,
	getAgencyBooking,
	addAgencyCertification,
} = require("../controllers/agency");

// param
router.param("agencyId", getAgencyById);

// Get Routes
router.get("/agency/:agencyId", getAgency);

// Get All agency
router.get("/agencies", getAllAgencies);

// update Agency Route
router.put(
	"/agency/update/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAgencyVarified,
	[
		check(
			"agencyName",
			"Agency Name should be of minimum 3 character and maximum 64 character"
		).isLength({
			min: 3,
			max: 64,
		}),
		check(
			"agencyOverview",
			"Agency Overview should be of 3 character"
		).isLength({
			max: 1024,
		}),
		body("agencyAvatarUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check("email", "Email should be in email formet")
			.isEmail()
			.normalizeEmail(),
		check("password", "you can not update your password here").isLength({
			max: 0,
		}),
		check(
			"phone",
			"Phone Number should be valid Mobile Number"
		).isMobilePhone(),
		check(
			"isVarified",
			"You can not varify yourself Only admin can do that"
		).isLength({
			max: 0,
		}),
		check(
			"officeAddress",
			"Office Address should be of maximum 128 character"
		).isLength({
			max: 128,
		}),
		check("city", "city should be of maximum 64 character").isLength({
			min: 0,
			max: 64,
		}),
		check("state", "state should be of maximum 32 character").isLength({
			max: 32,
		}),
		check("country", "country should be of maximum 64 character").isLength({
			max: 64,
		}),
		check("totalEarning", "You can not define your own totalEarning").isLength({
			max: 0,
		}),
		check(
			"encry_password",
			"You can not define your own encry_password"
		).isLength({
			max: 0,
		}),
		check("salt", "You can not define your own salt").isLength({
			max: 0,
		}),
		check("role", "You can not define your own role").isLength({
			max: 0,
		}),
		check(
			"inboxNotification",
			"You can not define your own inboxNotification"
		).isLength({
			max: 0,
		}),
		check("tourProvides", "You can not define tourProvides").isLength({
			max: 0,
		}),
		check(
			"agencyCertifications",
			"agencyCertifications can not be defined here"
		).isLength({
			max: 0,
		}),

		check("bookings", "bookings can not be defined here").isLength({
			max: 0,
		}),
	],
	updateAgency
);

// Updete Agency Password
router.put(
	"/agency/update/password/:agencyId",
	isSignedIn,
	isAuthenticated,
	[
		check("oldPassword", "Old Password should be at least 6 char").isLength({
			min: 6,
		}),
		check("newPassword", "New Password should be at least 6 char").isLength({
			min: 6,
		}),
	],
	updateAgencyPassword
);

// Updete Agency Avatar
router.put(
	"/agency/update/avatar/:agencyId",
	isSignedIn,
	isAuthenticated,
	[
		body("agencyAvatarUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	updateAgencyAvatar
);

// can be done by getAllTours

// Get all Agency Tours
// router.get("/agency/tours/:agencyId", isSignedIn, isAuthenticated, );

// Notification

// Get agency Inbox
router.get(
	"/agency/inbox/:agencyId",
	isSignedIn,
	isAuthenticated,
	getAgencyInbox
);

// Add agency Notification
router.post(
	"/agency/inbox/notify/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	[
		check("title", "title should be String and in Between 3-256 Char. ")
			.isString()
			.isLength({
				max: 256,
				min: 3,
			}),
		check("message", "Message should be String and in Between 3-1024 Char. ")
			.isString()
			.isLength({
				max: 1024,
				min: 3,
			}),
		body("agencyId").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("agencyId should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	addAgencyInbox
);

// agencyCertification

// Get agency Certification
router.get(
	"/agency/certificates/:agencyId",
	isSignedIn,
	isAuthenticated,
	getAgencyCertificates
);

// Add agency Certificates
router.post(
	"/agency/certificates/add/:agencyId",
	isSignedIn,
	isAuthenticated,
	[
		check("name", "name should be String and in Between 3-128 Char. ").isLength(
			{
				max: 128,
				min: 3,
			}
		),
		check(
			"description",
			"description should be String and in Between 3-1024 Char. "
		).isLength({
			max: 1024,
			min: 3,
		}),
		body("imageUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	addAgencyCertification
);

// remove agency Certification
router.delete(
	"/agency/certificates/remove/:agencyId",
	isSignedIn,
	isAuthenticated,
	[
		body("certificate.imageUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check(
			"certificate.name",
			"name should be String and in Between 3-128 Char. "
		).isLength({
			max: 128,
			min: 3,
		}),
		check(
			"certificate.description",
			"description should be String and in Between 3-1024 Char. "
		).isLength({
			max: 1024,
			min: 3,
		}),
		body("certificate.createdAt").custom((value) => {
			let createAt = new Date(value);

			if (createAt == "Invalid Date") {
				throw new Error(`${value} should be in Date Format`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("certificate.updatedAt").custom((value) => {
			let createAt = new Date(value);

			if (createAt == "Invalid Date") {
				throw new Error(`${value} should be in Date Format`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	removeAgencyCertification
);

// Get agency Bookings
router.get(
	"/agency/booking/:agencyId",
	isSignedIn,
	isAuthenticated,
	getAgencyBooking
);

module.exports = router;
