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
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check("password", "Password should be at least 6 char").isLength({
			min: 6,
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
		check("password", "Password should be at least 6 char").isLength({
			min: 6,
		}),
	],
	signin
);

router.get("/signout", signout);

// Agency routes

router.post(
	"/agency/signup",
	[
		check("agencyName", "Agency Name should be of 3 character").isLength({
			min: 3,
			max: 64,
		}),
		body("agencyAvatarUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check("email", "Email is required").isEmail().normalizeEmail(),
		check("password", "Password should be at least 6 char").isLength({
			min: 6,
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
	],
	agencySignup
);

router.post(
	"/agency/signin",
	[
		// if error occur go to docs or use .withMessage('must be at least 5 chars long') after is length
		check("email", "email is required").isEmail().normalizeEmail(),
		check(
			"password",
			"password field is required and should be of length 6 char"
		).isLength({
			min: 6,
		}),
	],
	agencySignin
);

router.get("/agency/signout", agencySignout);

module.exports = router;
