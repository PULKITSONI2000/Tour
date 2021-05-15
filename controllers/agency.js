const { Agency, reviewSchema } = require("../models/Agency");
const { validationResult } = require("express-validator");

// param
exports.getAgencyById = (req, res, next, id) => {
	Agency.findById(id)
		.populate("tourProvides", "_id tourTitle images")
		.exec((err, agency) => {
			if (err || !agency) {
				return res.status(400).json({
					msg: "No Agecny was found in DataBase",
					error: err,
				});
			}
			agency.tourProvides.forEach((tour) => {
				tour.images = tour?.images[0];
			});

			req.profile = agency;
			next();
		});
};

/**
 * Get Agency details
 */
exports.getAgency = (req, res) => {
	// undefined values does not even shown up so it is best then assigning "" string
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	req.profile.createdAt = undefined;
	req.profile.updatedAt = undefined;
	return res.json(req.profile);
};

/**
 * Get All Agencyes for Users
 */
exports.getAllAgencies = (req, res) => {
	Agency.find({ isVarified: 1 })
		.select("_id agencyName email city state agencyAvatarUrl")
		.exec((err, agency) => {
			if (err || !agency) {
				return res.status(400).json({
					msg: "No agencies are found in DataBase",
					error: err,
				});
			}
			// console.log(agency);
			// agency.forEach((agency) => {
			// 	agency.salt = undefined;
			// 	agency.encry_password = undefined;
			// 	agency.inboxNotification = undefined;
			// 	agency.bookings = undefined;
			// 	agency.isVarified = undefined;
			// 	agency.totalEarning = undefined;
			// 	agency.createdAt = undefined;
			// 	agency.updatedAt = undefined;
			// });

			return res.json(agency);
		});
};

/**
 * Get All Agency Details for Admin
 */
exports.getAllAgencyDetails = (req, res) => {
	Agency.find()
		.sort([
			["isVarified", "asc"],
			["role", "asc"],
		])
		.exec((err, agency) => {
			if (err || !agency) {
				return res.status(400).json({
					msg: "No agencies are found in DataBase",
					error: err,
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

/**
 * Update Agency details
 */
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
					msg: "Unable to update the agency details in DataBase",
					error: err,
				});
			}
			res.json({
				msg: `${agency.agencyName}, Successfully updated agency details`,
			});
		}
	);
};

/**
 *  update Agency avatar
 */
exports.updateAgencyAvatar = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	Agency.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $set: { agencyAvatarUrl: req.body.agencyAvatarUrl } }, //update the fields
		{ new: true },
		// usefindAndModify: false
		// compulsary parameter to pass when using .findByIdAndUpdate()
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					msg: "Unable to update the agency avatar in DataBase",
					error: err,
				});
			}
			res.json({
				msg: "Succeccfully Updated Agency Avatar",
				agencyAvatarUrl: agency.agencyAvatarUrl,
			});
		}
	);
};

/**
 *  update Agency Password
 */
exports.updateAgencyPassword = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	Agency.findById(req.profile._id).exec((err, agency) => {
		if (err || !agency) {
			return res.status(400).json({
				msg: "Unable to find agency in DataBase",
				error: err,
				user: typeof agency,
			});
		}

		if (!agency.authenticate(req.body.oldPassword)) {
			return res.status(401).json({
				msg: "Old Password did not match",
			});
		} else {
			Agency.findByIdAndUpdate(
				{ _id: agency._id },
				{
					$set: { encry_password: agency.securePassword(req.body.newPassword) },
				}, //update the fields
				{ new: true },
				// usefindAndModify: false
				// compulsary parameter to pass when using .findByIdAndUpdate()
				(err, agency) => {
					if (err) {
						return res.status(400).json({
							msg: "Unable to update agency Password in DataBase",
							error: err,
						});
					}
					res.json({
						msg: `${agency.agencyName}, Succeccfully Updated Passwoed`,
					});
				}
			);
		}
	});
};

/**
 * Varify Agency
 */
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
					msg: "Unable to varify Seller",
					error: err,
				});
			}
			return res.json({ msg: `Successfully Varify the ${agency.agencyName}` });
		}
	);
};

// agencyCertification

/**
 * Get agencyCertification
 */
exports.getAgencyCertificates = (req, res) => {
	Agency.findById(req.profile._id).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				msg: "No Certification found in database",
				error: err,
			});
		}
		return res.json(agency.agencyCertifications);
	});
};

/**
 * add agencyCertification
 */
exports.addAgencyCertification = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}
	// console.log(req.body);
	Agency.findOneAndUpdate(
		{ _id: req.profile._id },
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
			if (err || !agency) {
				return res.status(400).json({
					msg: "Unable to Add certificate in Agency details",
					error: err,
				});
			}
			return res.json({
				msg: `${agency.agencyName}, is successfully added in Certifications`,
			});
		}
	);
};

/**
 * remove agencyCertification
 */
exports.removeAgencyCertification = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}
	Agency.findOneAndUpdate(
		{ _id: req.profile._id },
		{
			$pull: {
				agencyCertifications: req.body.certificate,
			},
		},
		{ new: true }, // here {new: true} means send me back the updated one form DB not the old one
		(err, agency) => {
			if (err) {
				return res.status(400).json({
					msg: "Unable to remove certificate in Agency details",
					error: err,
				});
			}
			return res.json({
				msg: `${req.body.certificate.name}  is successfully remove from Certifications`,
			});
		}
	);
};

// inboxNotification

/**
 * Get Notification
 */
exports.getAgencyInbox = (req, res) => {
	Agency.findById(req.profile._id).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				msg: "No inbox notification found in catabase",
				error: err,
			});
		}
		return res.json(agency.inboxNotification);
	});
};

/**
 *  add Notification
 */
exports.addAgencyInbox = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}
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
			if (err || !agency) {
				return res.status(400).json({
					msg: "Unable to Send notification to Agency",
					error: err,
				});
			}
			return res.json({
				msg: `Notification is successfully send to ${agency.agencyName}`,
			});
		}
	);
};

// Tour List

/// can be done by getAllTours
// Get Agency Tours
// exports.getAgencyTour = (req, res) => {
// 	Agency.findById(req.profile._id)
// 		.populate("tourProvides", "_id tourName images tourPrice location")
// 		.exec((err, agency) => {
// 			if (err) {
// 				return res.status(400).json({
// 					msg: "No tour found in database",
// 					error: err,
// 				});
// 			}
// 			return res.json(agency.tourProvides);
// 		});
// };

/**
 * Add Tour in product list
 */
exports.addAgencyTour = (req, res) => {
	Agency.findOneAndUpdate(
		{ _id: req.profile._id },
		{ $push: { tourProvides: req.newTour._id } },
		{ new: true } // here {new: true} means send me back the updated one form DB not the old one
	).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				msg: "Not able to save tour in agency tour list in DataBase",
				error: err,
			});
		}
		return res.json({
			msg: `${req.newTour?.tourTitle}, is Successfully created`,
		});
	});
};

/**
 *  Remove tour form tourlist
 */
exports.removeAgencyTour = (req, res) => {
	Agency.findByIdAndUpdate(
		{ _id: req.profile._id },
		{ $pull: { tourProvides: req.tour._id } },
		{ new: true, upsert: false, multi: true }
	).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				msg: "Unable to remove tour form agency tourList",
				error: err,
			});
		}
		return res.json({
			msg: `${req.removedTour?.tourTitle} is Successfully removed`,
		});
	});
};

// booking List

// Get Agency Booking
exports.getAgencyBooking = (req, res) => {
	Agency.findById(req.profile._id)
		.select("bookings")
		.populate(
			"bookings",
			"_id status bookedOn tourId location tourists startingDate endingDate"
		)
		.exec((err, agency) => {
			if (err) {
				return res.status(400).json({
					msg: "No Booking found in database",
					error: err,
				});
			}
			return res.json(agency.bookings);
		});
};

// Add Booking in bookinglist
exports.addAgencyBooking = (req, res) => {
	Agency.findOneAndUpdate(
		{ _id: req.newBooking.agencyId },
		{
			$push: { bookings: req.newBooking._id },
			$inc: {
				totalEarning: +req.newBooking.totalAmount,
			},
		},
		{ new: true } // here {new: true} means send me back the updated one form DB not the old one
	).exec((err, agency) => {
		if (err) {
			return res.status(400).json({
				msg: "Not able to save Booking in agency Booking list in DataBase",
				error: err,
			});
		}
		res.json({
			msg: "successfully Booked",
		});
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
