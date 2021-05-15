const express = require("express");
const {
	varifyAgency,
	getAllAgencyDetails,
	getAgencyById,
} = require("../controllers/agency");
const { getAllBooking } = require("../controllers/booking");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { body } = require("express-validator");
const router = express.Router();

// param
router.param("agencyId", getAgencyById);

// varifyAgency
router.put(
	"/admin/varify/agency/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	[
		body("agencyId").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("agencyId should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	varifyAgency
);

// Get all agency Details for admin
router.get(
	"/admin/all/agency/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getAllAgencyDetails
);

// Get all booking Details for admin
router.get(
	"/admin/all/booking/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getAllBooking
);

module.exports = router;
