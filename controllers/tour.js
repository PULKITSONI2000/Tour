const Tour = require("../models/Tour");
const { validationResult } = require("express-validator");

// params
exports.getTourById = (req, res, next, id) => {
	Tour.findById(id)
		.populate("providerAgency", "_id agencyName agencyAvatarUrl")
		.populate("category", "_id categoryName categoryImageUrl")
		.populate("review.userId", "_id userName userAvatarUrl firstName lastName")
		.exec((err, tour) => {
			if (err) {
				return res.status(400).json({
					error: "Tour not found",
				});
			}
			req.tour = tour;
			next();
		});
};

// Get Product
exports.getTour = (req, res) => {
	return res.json(req.tour);
};

// Get all Product
exports.getAllTours = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 10; // in major languages querry is passed in string format
	let skip = req.query.skip ? parseInt(req.query.skip) : 0; // im major languages querry is passed in string format
	let maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : 9999999999; // im major languages querry is passed in string format
	let minPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : 0; // im major languages querry is passed in string format
	let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
	let order = req.query.order ? req.query.order : "desc";
	let category = req.query.category ? req.query.category : "";

	if (category) {
		Tour.find({
			$and: [
				{
					tourPrice: { adult: { $gte: minPrice } },
					tourPrice: { adult: { $lte: maxPrice } },
				},
			],
			category: req.category,
		})
			// .select("name price stock photo offer color size seller") // '-' to remove that field
			.populate("providerAgency", "_id agencyName agencyAvatarUrl")
			.populate("category", "_id categoryName categoryImageUrl")
			.sort([[sortBy, order]]) // for sorting
			.skip(skip)
			.limit(limit)
			.exec((err, tour) => {
				if (err) {
					return res.status(400).json({
						error: "No tour found",
					});
				}
				tour.imageUrl = tour.images[0];
				tour.images = undefined;
				res.json(tour);
			});
	} else {
		Tour.find({
			$and: [
				{
					tourPrice: { adult: { $gte: minPrice } },
					tourPrice: { adult: { $lte: maxPrice } },
				},
			],
		})
			// .select("name price stock photo offer color size seller") // '-' to remove that field
			.populate("providerAgency", "_id agencyName agencyAvatarUrl")
			.populate("category", "_id categoryName categoryImageUrl")
			.sort([[sortBy, order]]) // for sorting
			.skip(skip)
			.limit(limit)
			.exec((err, tour) => {
				if (err) {
					return res.status(400).json({
						error: "No tour found",
					});
				}
				res.json(tour);
			});
	}
};

// Get Search Product
// exports.getSearchProduct = (req, res) => {
// 	// im major languages querry is passed in string format
// 	let item = req.query.search ? req.query.search : " ";

// 	Tour.find()
// 		.select("_id name price stock photo offer size color description") // '-' to remove that field
// 		.exec((err, products) => {
// 			if (err) {
// 				return res.status(400).json({
// 					error: "No product found",
// 				});
// 			}
// 			// fuse Search
// 			const options = {
// 				// isCaseSensitive: false,
// 				// includeScore: false,
// 				shouldSort: true,
// 				// includeMatches: false,
// 				// findAllMatches: false,
// 				// minMatchCharLength: 1,
// 				// location: 0,
// 				threshold: 0.3,
// 				// distance: 100,
// 				// useExtendedSearch: false,
// 				// ignoreLocation: false,
// 				// ignoreFieldNorm: false,
// 				keys: ["name", "description", "color"],
// 			};
// 			const fuse = new Fuse(products, options);

// 			res.json(fuse.search(item));
// 		});
// };

// Get all Product Name
// exports.getAllProductsName = (req, res) => {
// 	Tour.find()
// 		.select("name _id") // '-' to remove that field
// 		.exec((err, products) => {
// 			if (err) {
// 				return res.status(400).json({
// 					error: "No product found",
// 				});
// 			}
// 			res.json(products);
// 		});
// };

// Get Products by Category
exports.getTourByCategory = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 10; // im major languages querry is passed in string format

	Tour.find({ category: req.category })
		.select("tourTitle tourPrice images") // '-' to remove that field
		.exec((err, tour) => {
			if (err) {
				return res.status(400).json({
					error: "No product found",
				});
			}
			tour.imageUrl = tour.images[0];
			tour.images = undefined;
			res.json(tour);
		});
};

// Get All active category // can be used under nav bar
// exports.getAllUniqueCategories = (req, res) => {
// 	Tour.distinct(
// 		"category",
// 		{
// 			/* clicks: {$gt: 100} // condition  */
// 		},
// 		(err, category) => {
// 			if (err) {
// 				return res.status(400).json({
// 					error: "NO category found",
// 					msg: err,
// 				});
// 			}
// 			res.json(category);
// 		}
// 	);
// };

// Create Product
exports.createTour = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	const tour = new Tour(req.body);
	tour.save((err, tour) => {
		if (err) {
			return res.status(400).json({
				error: "Not able to save Tour in DataBase",
				msg: err,
			});
		}
		req.newTour = {
			_id: tour._id,
			tourName: tour.tourName,
			// TODO:  add more id needed
		};
		next();
	});
};

// Delete product
exports.removeTour = (req, res, next) => {
	let tour = req.tour;
	tour.remove((err, removeTour) => {
		if (err) {
			return res.status(400).json({
				error: "Failed to remove the Tour",
			});
		}
		res.removeTour({
			message: "Successfully remove",
			removeTour: removeTour,
		});
		next();
	});
};

// Update tour
exports.updateTour = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	Tour.findByIdAndUpdate(
		{ _id: req.product._id },
		{ $set: req.body }, //update the fields
		{ new: true, usefindAndModify: false }, // compulsary parameter to pass when using .findByIdAndUpdate()
		(err, tour) => {
			if (err) {
				return res.status(400).json({
					error: "Not able to update the tour",
					msg: err,
				});
			}
			// undefined values does not even shown up so it is best then assigning "" string
			//   product.seller = undefined;
			tour.review = undefined;
			tour.createdAt = undefined;
			tour.updatedAt = undefinedo;
			res.json(tour);
		}
	);
};

//TODO: Add Review
exports.addTourReview = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	User.findByIdAndUpdate(
		{ _id: req.tour._id },
		{
			$push: { review: { userId: req.profile._id, review: req.review } },
		},
		{ new: true },
		(err, tour) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to add review in review list",
				});
			}
			return res.json({ msg: "review added Successfully" });
		}
	);
};

//TODO: Add Review
exports.updateNoOfBooking = (req, res, next) => {
	User.findByIdAndUpdate(
		{ _id: req.tour._id },
		{
			$inc: { noOfBooking: +1 },
		},
		{ new: true },
		(err, tour) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to add review in review list",
				});
			}
			return res.json({ msg: "review added Successfully" });
		}
	);
};
