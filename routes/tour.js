const express = require("express");

const { getUserById } = require("../controllers/user");
const {
	isSignedIn,
	isAuthenticated,
	isSellerVarified,
} = require("../controllers/auth");
const {} = require("../controllers/tour");
const { check } = require("express-validator");
const {} = require("../controllers/tour");
const { getCategoryById } = require("../controllers/category");
const router = express.Router();

// all of params
router.param("userId", getUserById);

// Create Route
router.post(
	"/product/create/:sellerId",
	isSignedIn,
	isAuthenticated,
	isSellerVarified,
	[
		check("name", "Name should be of 3 character").isLength({
			min: 3,
			max: 200,
		}),
		check("price", "Price should be Numaric").isNumeric(),
		check("description", "description should be at least 6 char").isLength({
			min: 6,
			max: 2000,
		}),
		check("stock", "Stock should be Numaric").isNumeric(),
		check("offer", "Stock should be Numaric").isNumeric().isLength({
			max: 3,
		}),
		check(
			"color",
			"Color should be at least 3 char and at most 32 char"
		).isLength({
			min: 3,
			max: 32,
		}),
		check(
			"size",
			"size should be at least 3 char and at most 32 char"
		).isLength({
			min: 3,
			max: 32,
		}),
		check("photo", "photo should be a imageUrl").isURL(),
		check(
			"isVarified",
			"You can not varify yourself Only admin can do that"
		).isLength({
			max: 0,
		}),
	],
	createProduct,
	addProductInSellerProductList
);

// Get Route
router.get("/product/:productId", getProduct);
router.get("/products", getAllProducts);
router.get("/search", getSearchProduct);
router.get("/products/name", getAllProductsName);
router.get("/products/categories", getAllUniqueCategories);
router.get("/products/:categoryId", getProductsByCategory);

// delete Route
router.delete(
	"/product/remove/:productId/:sellerId",
	isSignedIn,
	isAuthenticated,
	isSellerVarified,
	removeProductFromSellerProductList,
	deleteProduct
);
// update route
router.put(
	"/product/update/:productId/:sellerId",
	isSignedIn,
	isAuthenticated,
	isSellerVarified,
	[
		check("name", "Name should be of 3 character").isLength({
			min: 3,
			max: 200,
		}),
		check("price", "Price should be Numaric").isNumeric(),
		check("description", "description should be at least 6 char").isLength({
			min: 6,
			max: 2000,
		}),
		check("stock", "Stock should be Numaric").isNumeric(),
		check("offer", "Stock should be Numaric").isNumeric().isLength({
			max: 3,
		}),
		check(
			"color",
			"Color should be at least 3 char and at most 32 char"
		).isLength({
			min: 3,
			max: 32,
		}),
		check(
			"size",
			"size should be at least 3 char and at most 32 char"
		).isLength({
			min: 3,
			max: 32,
		}),
		check("photo", "photo should be a imageUrl").isURL(),
		check(
			"isVarified",
			"You can not varify yourself Only admin can do that"
		).isLength({
			max: 0,
		}),
	],
	updateProduct
);

module.exports = router;

//TODO: Add review
