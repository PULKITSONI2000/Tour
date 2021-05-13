const express = require("express");

const {
	isSignedIn,
	isAuthenticated,
	isAgencyVarified,
} = require("../controllers/auth");
const { check, body } = require("express-validator");
const {
	getAgencyById,
	removeAgencyTour,
	addAgencyTour,
} = require("../controllers/agency");
const { getCategoryById } = require("../controllers/category");
const {
	getTourById,
	getAllTours,
	getTourByCategory,
	createTour,
	getTour,
	removeTour,
	updateTour,
	addTourReview,
} = require("../controllers/tour");
const router = express.Router();

// TODO:  test all of them

// all of params
router.param("agencyId", getAgencyById);
router.param("tourId", getTourById);
router.param("categoryId", getCategoryById);

// Get Route
router.get("/tour/:tourId", getTour);
router.get("/tours", getAllTours);
router.get("/tours/:categoryId", getTourByCategory);

// router.get("/tour/categories", getAllUniqueCategories);
// router.get("/products/name", getAllProductsName);
// router.get("/search", getSearchProduct);

// Create Tour
router.post(
	"/tour/create/:agencyId",
	isSignedIn,
	isAuthenticated,
	isAgencyVarified,
	[
		check("tourTitle", "tourTitle length should be in between 3 to 200")
			.isString()
			.isLength({
				min: 3,
				max: 200,
			}),

		check(
			"tourOverview",
			"tourOverview should be at least 6 char and at most of 2000"
		).isLength({
			min: 6,
			max: 2000,
		}),

		body("providerAgency").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("providerAgencyId should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
		// check("tourPrice", "tourPrice should be Numaric").isObject(),
		body("tourPrice").custom((value) => {
			if (value.adult <= 0) {
				throw new Error("Adult Price should be Numaric");
			}
			if (value.child <= 0) {
				throw new Error("Child Price should be Numaric");
			}
			if (value.infant <= 0) {
				throw new Error("Infant Price should be Numaric");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),

		check("location", "Stock should be Numaric").isString().isLength({
			min: 3,
			max: 128,
		}),
		body("images").custom((value) => {
			if (value.length === 0) {
				throw new Error("images should contain at least one image");
			}
			value.forEach((i) => {
				if (!i.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
					throw new Error(`${i} is not a imageURL`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("itinerary").custom((value) => {
			value.forEach((i) => {
				if (!i.title.match(/^[0-9A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${i.title}, title should String`);
				}
				if (!i.description.match(/^[0-9A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${i.description}, description should String`);
				}
				if (!i.image.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
					throw new Error(`${i.image}, image should contain imageUrl`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("highlights").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("included").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("excluded").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("languages").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,\(\)]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),

		body("tourDuration").custom((value) => {
			if (!value.match(/^[0-9]+ (hours|Hours|hour|day|days|Days)$/)) {
				throw new Error(
					"tureDuration should be in format of - 5 Hours , 3 Days"
				);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),

		body("coordinates").custom((value) => {
			const checkForCoordinates = new RegExp("^[-]?[0-9]+.[0-9]+$");
			if (!checkForCoordinates.test(value.long)) {
				throw new Error(`${value.long}, long should be geo Coordinate`);
			}
			if (!checkForCoordinates.test(value.lat)) {
				throw new Error(`${value.lat}, lat should be geo Coordinate`);
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),

		body("faq").custom((value) => {
			value.forEach((f) => {
				if (!f.q.match(/^[0-9A-Za-z\-\ \'\"\?\,]+$/)) {
					throw new Error("title should String");
				}
				if (!f.ans.match(/^[0-9A-Za-z\-\ \.\,]+$/)) {
					throw new Error("description should String");
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),

		check("noOfBooking", "you can not define no of booking").isLength({
			max: 0,
		}),

		body("category").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("category should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check("review", "you can not create review").isLength({
			max: 0,
		}),
	],
	createTour,
	addAgencyTour
);

// delete Tour
router.delete(
	"/tour/remove/:agencyId/:tourId",
	isSignedIn,
	isAuthenticated,
	isAgencyVarified,

	removeTour,
	removeAgencyTour
);
// update Tour
router.put(
	"/tour/update/:agencyId/:tourId",
	isSignedIn,
	isAuthenticated,
	isAgencyVarified,
	[
		check("providerAgency", "providerAgency can not be change").isLength({
			max: 0,
		}),
		check(
			"tourTitle",
			"tourTitle length should be in between 3 to 200"
		).isLength({
			min: 3,
			max: 200,
		}),
		check(
			"tourOverview",
			"tourOverview should be at least 6 char and at most of 2000"
		).isLength({
			min: 6,
			max: 2000,
		}),

		// check("tourPrice", "tourPrice should be Numaric").isObject(),
		body("tourPrice").custom((value) => {
			if (value.adult <= 0) {
				throw new Error("Adult Price should be Numaric");
			}
			if (value.child <= 0) {
				throw new Error("Child Price should be Numaric");
			}
			if (value.infant <= 0) {
				throw new Error("Infant Price should be Numaric");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),

		check("location", "Stock should be Numaric").isLength({
			min: 3,
			max: 128,
		}),
		body("images").custom((value) => {
			if (value.length === 0) {
				throw new Error("images should contain at least one image");
			}
			value.forEach((i) => {
				if (!i.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
					throw new Error(`${i} is not a imageURL`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("itinerary").custom((value) => {
			value.forEach((i) => {
				if (!i.title.match(/^[0-9A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${i.title}, title should String`);
				}
				if (!i.description.match(/^[0-9A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${i.description}, description should String`);
				}
				if (!i.image.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)) {
					throw new Error(`${i.image}, image should contain imageUrl`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("highlights").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("included").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("excluded").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),
		body("languages").custom((value) => {
			value.forEach((h) => {
				if (!h.match(/^[A-Za-z\-\ \.\,\(\)]+$/)) {
					throw new Error(`${h} is not String`);
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),

		body("tourDuration").custom((value) => {
			if (!value.match(/^[0-9]+ (hours|Hours|hour|day|days|Days)$/)) {
				throw new Error(
					"tureDuration should be in format of - 5 Hours , 3 Days"
				);
			}

			// Indicates the success of this synchronous custom validator
			return true;
		}),

		body("coordinates").custom((value) => {
			const checkForCoordinates = new RegExp("^[-]?[0-9]+.[0-9]+$");
			if (!checkForCoordinates.test(value.long)) {
				throw new Error(`${value.long}, long should be geo Coordinate`);
			}
			if (!checkForCoordinates.test(value.lat)) {
				throw new Error(`${value.lat}, lat should be geo Coordinate`);
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),

		body("faq").custom((value) => {
			value.forEach((f) => {
				if (!f.q.match(/^[0-9A-Za-z\-\ \'\"\?\,]+$/)) {
					throw new Error("title should String");
				}
				if (!f.ans.match(/^[0-9A-Za-z\-\ \.\,]+$/)) {
					throw new Error("description should String");
				}
			});

			// Indicates the success of this synchronous custom validator
			return true;
		}),

		check("noOfBooking", "you can not define no of booking").isLength({
			max: 0,
		}),

		body("category").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("category should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check("review", "you can not create review").isLength({
			max: 0,
		}),
	],
	updateTour
);

//Add review
router.post(
	"/tour/review/add/:tourId/:userId",
	isSignedIn,
	[
		body("userId").custom((value) => {
			const checkForMongoDBId = new RegExp("^[0-9a-fA-F]{24}$");

			if (!checkForMongoDBId.test(value)) {
				throw new Error("User Id should be ObjectId");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
		check(
			"review",
			"Review should be String and in Between 3-200 Char. "
		).isLength({
			max: 1024,
			min: 8,
		}),
		body("stars").custom((value) => {
			if (value < 1 || value > 5) {
				throw new Error("stars should be in between 1 to 5");
			}
			// Indicates the success of this synchronous custom validator
			return true;
		}),
	],
	addTourReview
);

module.exports = router;
