const express = require("express");
var router = express.Router();

const { check, body } = require("express-validator");
const {
	signin,
	signup,
	signout,
	agencySignup,
	agencySignin,
	agencySignout,
} = require("../controllers/auth");

// User Routes

router.post(
	"/signup",
	// if error occur go to docs or use
	//   .withMessage('must be at least 5 chars long') after is length
	[
		check("userName", "User Name should be of 3 character").isLength({
			min: 3,
			max: 64,
		}),
		check("firstName", "First Name should be of 3 character")
			.isString()
			.isLength({
				min: 3,
				max: 32,
			}),
		check("lastName", "Last Name should be of 3 character")
			.isString()
			.isLength({
				min: 2,
				max: 32,
			}),
		body("userAvatarUrl").custom((value) => {
			if (value && !value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			return true;
		}),
		body("gender").custom((value) => {
			if (!value.match(/^(male|female|others)$/gi)) {
				throw new Error(
					`${value} is not a valid format (valid formats are - male, female or others)`
				);
			}

			return true;
		}),
		body("dob").custom((value) => {
			let dob = new Date(value);
			let currentDate = new Date();
			if (dob === "Invalid Date") {
				throw new Error("Date of Birth should be in date format");
			} else {
				if (Date.parse(dob) > Date.parse(currentDate)) {
					throw new Error("Date of Birth should be a future Date");
				}
			}

			return true;
		}),

		body("password").custom((value) => {
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
					`Password should contain at least one of all small latter, capital latter, digit, symbole`
				);
			}

			return true;
		}),
		check("email", "Email is required").isEmail().normalizeEmail(),
		check(
			"phone",
			"Phone Number should be valid Mobile Number"
		).isMobilePhone(),
	],
	signup
);

router.post(
	"/signin",
	[
		check("userName", "userName should be of 3 character").isLength({
			min: 3,
			max: 64,
		}),
		body("password").custom((value) => {
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
					`Password should contain at least one of all small latter, capital latter, digit, symbole`
				);
			}

			return true;
		}),
	],
	signin
);

router.get("/signout", signout);

/// Agency routes

router.post(
	"/agency/signup",
	[
		check("agencyName", "Agency Name should be of 3 character").isLength({
			min: 3,
			max: 64,
		}),
		check(
			"agencyOverview",
			"Agency Overview should be of 8 character"
		).isLength({
			min: 8,
			max: 1024,
		}),
		body("agencyAvatarUrl").custom((value) => {
			if (value && !value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}
			return true;
		}),
		check("email", "Email is required").isEmail().normalizeEmail(),
		body("password").custom((value) => {
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
					`Password should contain at least one of all small latter, capital latter, digit, symbole`
				);
			}

			return true;
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
		body("officeAddress").custom((value) => {
			if (value && (value.length < 8 || value.length > 128)) {
				throw new Error("Address must be in range of 8-128 character");
			}
			return true;
		}),
		body("city").custom((value) => {
			if (value && (value.length < 3 || value.length > 64)) {
				throw new Error("city must be in range of 3-64 character");
			}
			return true;
		}),
		body("state").custom((value) => {
			if (value && (value.length < 3 || value.length > 32)) {
				throw new Error("state must be in range of 3-32 character");
			}
			return true;
		}),
		body("country").custom((value) => {
			if (value && (value.length < 3 || value.length > 64)) {
				throw new Error("country must be in range of 3-64 character");
			}
			return true;
		}),
	],
	agencySignup
);

router.post(
	"/agency/signin",
	[
		// if error occur go to docs or use .withMessage('must be at least 5 chars long') after is length
		check("email", "email is required").isEmail().normalizeEmail(),
		body("password").custom((value) => {
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
					`Password should contain at least one of all small latter, capital latter, digit, symbole`
				);
			}

			return true;
		}),
	],
	agencySignin
);

router.get("/agency/signout", agencySignout);

module.exports = router;
