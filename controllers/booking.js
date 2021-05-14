const Booking = require("../models/Booking");

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
	// let serverTotalAmount = 0;
	// let tourPrice;

	// Tour.findById(req.body.booking.tourId)
	// 	.select("tourPrice")
	// 	.exec((err, tour) => {
	// 		tourPrice = tour;
	// 	});

	// req.body.booking.tourists.forEach((userId) => {
	// 	User.findById(userId).exec((err, user) => {});
	// });

	const newBooking = new Booking(req.body.booking);
	newBooking.save((err, booking) => {
		if (err) {
			return res.status(400).json({
				msg: "Failed to save Booking in DataBase",
				// MSMediaKeyError: err,
				error: err,
			});
		}
		res.newBooking = booking;
		next();
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
exports.getAllOrders = (req, res) => {
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
// exports.getOrderStatus = (req, res) => {
// 	res.json(Booking.schema.path("status").enumValues);
// };

/**
 * Update Status
 * only Tour Privider can change this status
 */
exports.updateStatus = (req, res) => {
	if (req.profile._id === req.booking.agencyId._id) {
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
					msg: `status is updated from "${oldStatus}" to "${booking.status}"`,
				});
			}
		);
	} else {
		return res.status(400).json({
			msg: `You are not the Owner of `,
		});
	}
};
