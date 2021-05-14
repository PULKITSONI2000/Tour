const express = require("express");
const { varifyAgency, getAllAgencyDetails } = require("../controllers/agency");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const router = express.Router();

// param
router.param("agencyId", getAgencyById);

// varifySeller
router.put(
	"/admin/varify/agency/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	varifyAgency
);

// Get all agency Details for admin
router.get(
	"/admin/all/agrncy/:agencyId",
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
	getAllBookingDetails
);

module.exports = router;
