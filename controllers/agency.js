const { Agency } = require("../models/Agency");
const { validationResult } = require("express-validator");

// param
exports.getAgencyById = (req, res, next, id) => {
	Agency.findById(id)
		.populate("tourProvides", "_id tourName images")
		.exec((err, agency) => {
			if (err || !agency) {
				return res.status(400).json({
					error: "No Agecny was found in DataBase",
					msg: err,
				});
			}
			req.profile = agency;
			next();
		});
};

// Get User
exports.getAgency = (req, res) => {
	// undefined values does not even shown up so it is best then assigning "" string
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	req.profile.createdAt = undefined;
	req.profile.updatedAt = undefined;
	return res.json(req.profile);
};

// Get All Seller
exports.getAllAgencies = (req, res) => {
	Agency.find({ isVarified: 1 }).exec((err, agency) => {
		if (err || !agency) {
			return res.status(400).json({
				error: "No agencies are found in DataBase",
				msg: err,
			});
		}
		agency.forEach((agency) => {
			agency.salt = undefined;
			agency.encry_password = undefined;
			agency.inboxNotification = undefined;
			agency.bookings = undefined;
			agency.isVarified = undefined;
			agency.totalEarning = undefined;
			agency.createdAt = undefined;
			agency.updatedAt = undefined;
		});

		return res.json(agency);
	});
};

/// for admin

// Get All Agency Details for Admin
exports.getAllAgencyDetails = (req, res) => {
	Agency.find()
		.sort([["isVarified", "asc"]])
		.exec((err, agency) => {
			if (err || !agency) {
				return res.status(400).json({
					error: "No agencies are found in DataBase",
					msg: err,
				});
			}
			agency.forEach((agency) => {
				agency.salt = undefined;
				agency.encry_password = undefined;
				agency.createdAt = undefined;
				agency.updatedAt = undefined;
			});

			return res.json(agency);
		});
};

// update Agency
exports.updateAgency = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	Agency.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: req.body }, //update the fields
		{ new: true, usefindAndModify: false },
		// compulsary parameter to pass when using .findByIdAndUpdate()
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to update the agency details in DataBase",
					msg: err,
				});
			}
			// agency.salt = undefined; // undefined values does not even shown up so it is best then assigning "" string
			// agency.encry_password = undefined;
			// agency.createdAt = undefined;
			// agency.updatedAt = undefined;
			// agency.rating = undefined;
			// agency.noOfRating = undefined;
			// agency.notification = undefined;
			// res.json(agency);
			res.json({ msg: "Successfully updated agency detauls" });
		}
	);
};

// update Agency avatar
exports.updateAgencyAvatar = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	User.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: { agencyAvatarUrl: req.body.agencyAvatarUrl } }, //update the fields
		{ new: true },
		// usefindAndModify: false
		// compulsary parameter to pass when using .findByIdAndUpdate()
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to update the agency avatar in DataBase",
					msg: err,
				});
			}
			// user.salt = undefined; // undefined values does not even shown up so it is best then assigning "" string
			// user.encry_password = undefined;
			// user.createdAt = undefined;
			// user.updatedAt = undefined;
			res.json({
				msg: "Succeccfully Updated userAvatar",
				userAvatarUrl: agency.userAvatarUrl,
			});
		}
	);
};

// Varify Agency
exports.varifyAgency = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	Agency.findByIdAndUpdate(
		{ _id: req.body.agencyId },
		{ $set: { isVarified: 1 } },
		{ new: true, upsert: false },
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to varify Seller",
					msg: err,
				});
			}
			// agency.salt = undefined; // undefined values does not even shown up so it is best then assigning "" string
			// agency.encry_password = undefined;
			// agency.createdAt = undefined;
			// agency.updatedAt = undefined;

			// return res.json(agency);
			return res.json({ msg: `Successfully Varify the ${agency.agencyName}` });
		}
	);
};

// agencyCertification

// Get agencyCertification
exports.getAgencyCertification = (req, res) => {
	Agency.findById(req.profile._id).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				error: "No Certification found in database",
				msg: err,
			});
		}
		return res.json(agency.agencyCertifications);
	});
};

// add agencyCertification
exports.addAgencyCertification = (req, res) => {
	Agency.findOneAndUpdate(
		{ _id: req.profile._Id },
		{
			$push: {
				agencyCertifications: {
					name: req.body.name,
					description: req.body.description,
					imageUrl: req.body.imageUrl,
				},
			},
		},
		{ new: true }, // here {new: true} means send me back the updated one form DB not the old one
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to Add certificate in Agency details",
				});
			}
			return res.json({
				msg: `${req.body.name}  is successfully added in Certifications`,
			});
		}
	);
};

// update agencyCertification
exports.removeAgencyCertification = (req, res) => {
	Agency.findOneAndUpdate(
		{ _id: req.profile._Id },
		{
			$pull: {
				agencyCertifications: req.body.certificate,
			},
		},
		{ new: true }, // here {new: true} means send me back the updated one form DB not the old one
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to remove certificate in Agency details",
				});
			}
			return res.json({
				msg: `${req.body.name}  is successfully remove from Certifications`,
			});
		}
	);
};

// inboxNotification

// Get Notification
exports.getAgencyInbox = (req, res) => {
	Agency.findById(req.profile._id).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				error: "No inbox notification found in catabase",
				msg: err,
			});
		}
		return res.json(agency.inboxNotification);
	});
};

// add Notification
exports.addAgencyInbox = (req, res) => {
	Agency.findOneAndUpdate(
		{ _id: req.body.agencyId },
		{
			$push: {
				inboxNotification: {
					title: req.body.title,
					message: req.body.message,
				},
			},
		},
		{ new: true }, // here {new: true} means send me back the updated one form DB not the old one
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to Send notification to Agency",
				});
			}
			return res.json({
				msg: `Notification is successfully send to ${agency.agencyName}`,
			});
		}
	);
};

// Tour List

// Get Agency Tours
exports.getAgencyInbox = (req, res) => {
	Agency.findById(req.profile._id)
		.populate("tourProvides", "_id tourName images tourPrice location")
		.exec((err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "No tour found in database",
					msg: err,
				});
			}
			return res.json(agency.tourProvides);
		});
};

// Add Product in product list
exports.addAgencyTour = (req, res) => {
	Agency.findOneAndUpdate(
		{ _id: req.profile._id },
		{ $push: { products: req.newTour._id } },
		{ new: true } // here {new: true} means send me back the updated one form DB not the old one
	).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				error: "Not able to save tour in agency tour list in DataBase",
				msg: err,
			});
		}
		return res.json({ msg: `${req.newTour.tourName} is Successfully created` });
	});
};

// Remove tour form tourlist
exports.removeAgencyTour = (req, res) => {
	Agency.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $pull: { products: req.tour._id } },
		{ new: true, upsert: false, multi: true }
	).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to remove tour form agency tourList",
				msg: err,
			});
		}
		return res.json({
			msg: `${req.newTour.tourName} is Successfully removed from agency tourList`,
		});
	});
};

// booking List

// Get Agency Booking
exports.getAgencyBooking = (req, res) => {
	Agency.findById(req.profile._id)
		.populate(
			"bookings",
			"_id status bookedOn tourId location tourists startingDate endingDate"
		)
		.exec((err, agency) => {
			if (err) {
				return res.status(400).json({
					error: "No Booking found in database",
					msg: err,
				});
			}
			return res.json(agency.bookings);
		});
};

// Add Booking in bookinglist
exports.addAgencyBooking = (req, res, next) => {
	Agency.findOneAndUpdate(
		{ _id: req.newTour.providerAgency },
		{ $push: { bookings: req.newTour._id } },
		{ new: true } // here {new: true} means send me back the updated one form DB not the old one
	).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				error: "Not able to save Booking in agency Booking list in DataBase",
				msg: err,
			});
		}
		next();
	});
};

// TODO: thinking about removing it
// Reviews

// exports.addAgencyReview = (req, res) => {
// 	const errors = validationResult(req);

// 	if (!errors.isEmpty()) {
// 		return res.status(422).json({
// 			error: errors.array(),
// 			// error: errors.array()[0].msg,
// 		});
// 	}

// 	User.findByIdAndUpdate(
// 		{ _id: req.body.agencyId },
// 		{
// 			$push: { review: { userId: req.profile._id, review: req.review } },
// 		},
// 		{ new: true },
// 		(err, agency) => {
// 			if (err) {
// 				return res.status(400).json({
// 					error: "Unable to add review in agency review list",
// 				});
// 			}
// 			return res.json({ msg: "review added Successfully" });
// 		}
// 	);
// };
