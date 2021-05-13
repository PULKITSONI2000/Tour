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
	if (req.tour === null) {
		return res.status(400).json({
			error: "tour not found",
		});
	}
	return res.json(req.tour);
};

// Get all Product
exports.getAllTours = async (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 10; // in major languages querry is passed in string format
	let skip = req.query.skip ? parseInt(req.query.skip) : 0; // default is 0
	let maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : 9999999999;
	let minPrice = req.query.minPrice ? parseInt(req.query.minPrice) : 0;
	let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
	let order = req.query.order ? req.query.order : "desc";
	let category = req.query.category ? req.query.category : false;
	let languages = req.query.languages ? req.query.languages : false;

	let findConditions = {};

	languages.length > 0 && (findConditions["languages"] = { $in: languages });
	category.length > 0 && (findConditions["category"] = { $in: category });

	console.log(findConditions);
	await Tour.find({
		...findConditions,
		$and: [
			{ "tourPrice.adult": { $lte: maxPrice } },
			{ "tourPrice.adult": { $gte: minPrice } },
		],
	})
		.select(
			"_id tourTitle tourPrice location images languages category noOfBooking tourDuration providerAgency"
		)
		.populate("providerAgency", "_id agencyName")
		.populate("category", "_id categoryName")
		.sort([[sortBy, order]])
		.skip(skip)
		.limit(limit)
		.exec((err, tours) => {
			if (err || tours.length === 0) {
				return res.status(400).json({
					msg: "No tour found",
					err: err,
				});
			}
			tours.forEach((tour) => {
				tour.images = tour.images[0];
			});

			res.json(tours);
		});
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
			tourTitle: tour.tourTitle,
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
		req.removedTour = {
			message: "Successfully remove",
			tourTitle: removeTour.tourTitle,
		};
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
		{ _id: req.tour._id },
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

			res.json({
				msg: `${tour.tourTitle} is Successfully updated`,
			});
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
			$push: {
				review: {
					userId: req.profile._id,
					review: req.review,
					stars: req.stars,
				},
			},
		},
		{ new: true },
		(err, tour) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to add review in review list",
				});
			}
			return res.json({
				msg: `review added Successfully on ${tour.tourTitle}`,
			});
		}
	);
};

// Update No Of booking
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
					error: "Unable to update No Of Booking",
				});
			}
			req.noOfBooking = {
				msg: `${tour.tourTitle} Number of booking is Successfully updated`,
			};
			next();
		}
	);
};
