const { User } = require("../models/User");
const { validationResult } = require("express-validator");
// const { json } = require("body-parser");

// param
exports.getUserById = (req, res, next, id) => {
	// FIXME:
	User.findById(id)
		// .populate("bookingHistory", "_id")
		.populate("inboxNotification", "_id title updatedAt")
		.exec((err, user) => {
			if (err || !user) {
				return res.status(400).json({
					msg: "No user was found in DataBase",
					error: err,
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
					msg: "Unable to update the user in DataBase",
					error: err,
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
					msg: "Unable to update the user in DataBase",
					error: err,
				});
			}
			res.json({
				msg: "Succeccfully Updated userAvatar",
				userAvatarUrl: user.userAvatarUrl,
			});
		}
	);
};

// update User Password
exports.updateUserPassword = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	User.findById(req.profile._id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				msg: "Unable to find user in DataBase",
				error: err,
				user: typeof user,
			});
		}

		// user.password = req.body.newPasswoed;
		if (!user.authenticate(req.body.oldPassword)) {
			return res.status(401).json({
				msg: "Old Password did not match",
			});
		} else {
			User.findByIdAndUpdate(
				{ _id: user._id },
				{ $set: { encry_password: user.securePassword(req.body.newPassword) } }, //update the fields
				{ new: true },
				// usefindAndModify: false
				// compulsary parameter to pass when using .findByIdAndUpdate()
				(err, user) => {
					if (err) {
						return res.status(400).json({
							msg: "Unable to update user Password in DataBase",
							error: err,
						});
					}
					res.json({
						msg: `${user.userName}, Succeccfully Updated Passwoed`,
					});
				}
			);
		}
	});
};

// check for  UserName
exports.checkforUserName = (req, res) => {
	User.find({ userName: req.body.userName })
		.select("_id userName userAvatarUrl")
		.exec((err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Some error occur while finding userName in DataBase",
					msg: err,
				});
			}
			if (user.length === 0) {
				return res.json({
					msg: "UserName is Unique",
					isUnique: 1,
					user: typeof user,
				});
			}

			return res.json({
				msg: "UserName is already used",
				isUnique: 0,
				user: user,
			});
		});
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
