const { User } = require("../models/User");
const { validationResult } = require("express-validator");
// const { json } = require("body-parser");

// param
exports.getUserById = (req, res, next, id) => {
	// FIXME:
	User.findById(id)
		// .populate("bookingHistory")
		// .populate("inboxNotification", "_id title updatedAt")
		.exec((err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: "No user was found in DataBase",
					msg: err,
				});
			}
			req.profile = user;
			next();
		});
};

// Get User
exports.getUser = (req, res) => {
	// undefined values does not even shown up so it is best then assigning "" string
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	req.profile.createdAt = undefined;
	req.profile.updatedAt = undefined;
	return res.json(req.profile);
};

// update User
exports.updateUser = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: req.body }, //update the fields
		{ new: true, usefindAndModify: false },
		// compulsary parameter to pass when using .findByIdAndUpdate()
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to update the user in DataBase",
					msg: err,
				});
			}
			user.salt = undefined; // undefined values does not even shown up so it is best then assigning "" string
			user.encry_password = undefined;
			user.createdAt = undefined;
			user.updatedAt = undefined;
			res.json(user);
		}
	);
};

// update User avatar
exports.updateUserAvatar = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: { userAvatarUrl: req.body.userAvatarUrl } }, //update the fields
		{ new: true },
		// usefindAndModify: false
		// compulsary parameter to pass when using .findByIdAndUpdate()
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to update the user in DataBase",
					msg: err,
				});
			}
			// user.salt = undefined; // undefined values does not even shown up so it is best then assigning "" string
			// user.encry_password = undefined;
			// user.createdAt = undefined;
			// user.updatedAt = undefined;
			res.json({
				msg: "Succeccfully Updated userAvatar",
				userAvatarUrl: user.userAvatarUrl,
			});
		}
	);
};

// Booking
//TODO: try some of this  - https://mongoosejs.com/docs/populate.html#deep-populate
// get Booking

exports.getUserBooking = (req, res) => {
	User.findById(req.profile._id)
		.populate("bookingHistory", " -transaction_id")
		.exec((err, user) => {
			if (err) {
				return res.status(400).json({
					error: "No Booking Found",
					msg: err,
				});
			}
			return res.json(user.bookingHistory);
		});
};

// Add Booking

exports.addUserBooking = (req, res) => {
	// const errors = validationResult(req);

	// 	if (!errors.isEmpty()) {
	// 		return res.status(422).json({
	// 			error: errors.array(),
	// 			// error: errors.array()[0].msg,
	// 		});
	// 	}

	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{
			$push: { bookingHistory: req.body.bookingId },
		},
		{ new: true },
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to Add Booking In bookingHistory list",
				});
			}
			return res.json({ msg: "Booking added Successfully" });
		}
	);
};

// Notification

// Get Notification
exports.getUserInbox = (req, res) => {
	User.findById(req.profile._id).exec((err, user) => {
		if (err) {
			return res.status(400).json({
				error: "No Inbox Notification found",
				msg: err,
			});
		}
		return res.json(user.inboxNotification);
	});
};

// add Notification
exports.addUserInbox = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	User.findOneAndUpdate(
		{ _id: req.body.userId },
		{
			$push: {
				inboxNotification: { title: req.body.title, message: req.body.title },
			},
		},
		{ new: true }, // here {new: true} means send me back the updated one form DB not the old one
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to Send notification to User",
				});
			}
			return res.json({ msg: "Notification sended Successfully" });
		}
	);
};
