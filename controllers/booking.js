const { validationResult } = require("express-validator");
const { set } = require("mongoose");
const Booking = require("../models/Booking");
const Tour = require("../models/Tour");
const { User } = require("../models/User");

/**
 * get Booking by id
 * @requires bookingId params
 */
exports.getBookingById = (req, res, next, id) => {
	Booking.findById(id)
		.populate(
			"tourists",
			"_id userName firstName lastName dob userAvatarUrl email phone gender"
		)
		.populate(
			"tourId",
			"_id tourTitle tourPrice location tourDuration category"
		)
		.populate("agencyId", "_id agencyName email phone agencyAvatarUrl")
		// .populate("tourId.category", "categoryName categoryImageUrl")
		.exec((err, booking) => {
			if (err) {
				return res.status(400).json({
					msg: "No Booking found in DataBase",
					error: err,
				});
			}
			req.booking = booking;
			next();
		});
};

/**
 *  Create Booking middelware
 * @todo complete the server validation for checking price
 */
exports.createBooking = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	// console.log(req.body);
	let serverTotalAmount = 0;
	let tourPrice;

	Tour.findById(req.body.tourId)
		.select("tourPrice")
		.exec((err, tour) => {
			if (err || !tour) {
				return res.status(400).json({
					msg: "tourId did not found in DataBase",
					error: err,
				});
			}
			tourPrice = tour.tourPrice;

			req.body.tourists.forEach((userId) => {
				User.findById(userId)
					.select("dob")
					.exec((err, user) => {
						if (err || !user) {
							return res.status(400).json({
								msg: "userId did not found in DataBase",
								error: err,
							});
						}
						const dob = new Date(user.dob);

						// full explanation

						// //calculate month difference from current date in time
						// const month_diff = Date.now() - dob.getTime();

						// //convert the calculated difference in date format
						// const age_dt = new Date(month_diff);

						// //extract year from date
						// const year = age_dt.getUTCFullYear();

						// //now calculate the age of the user
						// const age = Math.abs(year - 1970);

						const age_dt = new Date(Date.now() - dob.getTime());
						const age = Math.abs(age_dt.getUTCFullYear() - 1970);

						if (age >= 18) {
							serverTotalAmount += tourPrice.adult;
						} else {
							if (age >= 5) {
								serverTotalAmount += tourPrice.child;
							} else {
								serverTotalAmount += tourPrice.infant;
							}
						}

						if (serverTotalAmount !== parseInt(req.body.totalAmount)) {
							return res.status(400).json({
								msg: "There is some problem in totalAmount, it does not match with tour Pricing",
								err: "server calculated tour price does not match with given amout",
							});
						}

						const newBooking = new Booking(req.body);
						newBooking.save((err, booking) => {
							if (err || !booking) {
								return res.status(400).json({
									msg: "Failed to save Booking in DataBase",
									// MSMediaKeyError: err,
									error: err,
								});
							}
							req.newBooking = booking;
							next();
						});
					});
			});
		});
};

/**
 * get Booking info
 */
exports.getBooking = (req, res) => {
	return res.json(req.booking);
};

/**
 * fet all booking for admin
 * @requires agency to be a admin
 */
exports.getAllBooking = (req, res) => {
	Booking.find()
		.populate(
			"tourists",
			"_id userName firstName lastName dob userAvatarUrl email phone gender"
		)
		.populate(
			"tourId",
			"_id tourTitle tourPrice location tourDuration category"
		)
		.populate("agencyId", "_id agencyName email phone agencyAvatarUrl")
		// .populate("tourId.category", "categoryName categoryImageUrl")
		.exec((err, booking) => {
			if (err) {
				return res.status(400).json({
					msg: "No booking found in DataBase",
					error: err,
				});
			}
			res.json(booking);
		});
};

/// why we need this
// exports.getBookingStatus = (req, res) => {
// 	res.json(Booking.schema.path("status").enumValues);
// };

/**
 * Update Status
 * only Tour Privider can change this status
 */
exports.updateStatus = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}
	if (
		req.booking.status === "Cancelled" ||
		req.booking.status === "Completed"
	) {
		return res.status(400).json({
			msg: "you can not update Booking Status",
			error: `Booking is already ${req.booking.status}`,
		});
	}
	if (parseInt(req.profile._id) === parseInt(req.booking.agencyId._id)) {
		const oldStatus = req.booking.status;
		Booking.findByIdAndUpdate(
			{ _id: req.booking._id },
			{ $set: { status: req.body.status } },
			{ new: true, usefindAndModify: false },
			(err, booking) => {
				if (err) {
					return res.status(400).json({
						msg: "Cannot update booking status in DataBase",
						error: err,
					});
				}
				res.json({
					msg: `status is updated from '${oldStatus}' to ${booking.status}`,
				});
			}
		);
	} else {
		return res.status(400).json({
			msg: `You are not the tour Provide of this booking`,
		});
	}
};

/**
 * cancel booking
 * @requires user
 * @todo think about no need to subtract no of booking from tours
 */
exports.cancelBooking = (req, res, next) => {
	const startingDate = new Date(req.booking.startingDate);
	const diffDays = Math.ceil(
		Math.abs(Date.now() - startingDate) / (1000 * 60 * 60 * 24)
	);

	if (diffDays <= 3) {
		return res.status(400).json({
			msg: `You are late now you can not cancel the tour`,
			error: `only ${diffDays} left befour tour min limit is 3 days`,
		});
	}
	if (req.booking.status === "Cancelled") {
		return res.status(400).json({
			msg: `you already cancelled the booking`,
			error: `booking status is already set to Cancelled`,
		});
	}

	let isTourist = false;
	req.booking.tourists.forEach((user) => {
		if (String(user._id) == String(req.profile._id)) {
			isTourist = true;
		}
	});
	if (req.profile._id in req.booking.tourists || isTourist) {
		Booking.findByIdAndUpdate(
			{ _id: req.booking._id },
			{ $set: { status: "Cancelled" } },
			{ new: true, usefindAndModify: false },
			(err, booking) => {
				if (err || !booking) {
					return res.status(400).json({
						msg: "Cannot cancel booking in DataBase",
						error: err,
					});
				}
				next();
			}
		);
	} else {
		return res.status(400).json({
			msg: `You are not the tourist of this booking`,
		});
	}
};
