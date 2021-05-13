const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { check, body } = require("express-validator");
const {
	getCategoryById,
	createCategory,
	getCategory,
	getAllCategory,
	removeCategory,
	updateCategory,
	getActiveCategories,
} = require("../controllers/category");
const { getAgencyById } = require("../controllers/agency");

// params
router.param("agencyId", getAgencyById);
router.param("categoryId", getCategoryById);

// create route
router.post(
	"/category/create/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	[
		check(
			"categoryName",
			"categoryName should be at least 3 char and at most 32"
		)
			.isString()
			.isLength({
				min: 3,
				max: 32,
			}),
		check(
			"categoryDescription",
			"categoryDescription should be at least 3 char and at most 256"
		)
			.isString()
			.isLength({
				min: 3,
				max: 256,
			}),
		body("categoryImageUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	createCategory
);

// Get Routes
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);
router.get("/categories/active", getActiveCategories);

// Update Route
router.put(
	"/category/update/:agencyId/:categoryId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	[
		check(
			"categoryName",
			"categoryName should be at least 3 char and at most 32"
		)
			.isString()
			.isLength({
				min: 3,
				max: 32,
			}),
		check(
			"categoryDescription",
			"categoryDescription should be at least 3 char and at most 256"
		)
			.isString()
			.isLength({
				min: 3,
				max: 256,
			}),
		body("categoryImageUrl").custom((value) => {
			if (!value.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
				throw new Error(`${value} is not a imageURL`);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	updateCategory
);

// delete
router.delete(
	"/category/remove/:agencyId/:categoryId",
	isSignedIn,
	isAuthenticated,
	isAdmin,
	removeCategory
);

module.exports = router;
