const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const { validationResult } = require("express-validator");

const { User } = require("../models/User");
const Agency = require("../models/Agency");

///  User Auth
exports.signup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	var user = new User(req.body);
	user.save(
		(err, user) => {
			if (err) {
				return res.status(400).json({
					error: "Not able to save user in DataBase",
					msg: err,
					user: user,
				});
			}
			// create token
			const token = jwt.sign({ _id: user._id }, process.env.SECRET); // this secret is use later to test isSignin

			// put token in cookie
			res.cookie("token", token, { expire: new Date() + 30 });

			// sent response to front end
			const {
				_id,
				userName,
				firstName,
				lastName,
				email,
				phone,
				userAvatarUrl,
			} = user;

			return res.json({
				token,
				user: {
					_id,
					userName,
					firstName,
					lastName,
					email,
					phone,
					userAvatarUrl,
				},
			});
		},
		{ forceServerObjectId: true }
	);
};

exports.signin = (req, res) => {
	const { userName, password } = req.body;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	User.findOne({ userName: userName }, (err, user) => {
		// if (err || !user) {
		//   return res.status(400).json({
		//     error: "USER email does not exists",
		//   });
		// }

		if (err) {
			return res.status(400).json({
				error: "Unable to find user in DataBase",
				msg: err,
			});
		} else if (!user) {
			return res.status(400).json({
				error: "UserName does not exists",
			});
		}

		if (!user.authenticate(password)) {
			return res.status(401).json({
				error: "UserName or Password do not match",
			});
		}

		// create token
		const token = jwt.sign({ _id: user.id }, process.env.SECRET); // this secret is use later to test isSignin

		// put token in cookie
		res.cookie("token", token, { expire: new Date() + 30 });

		// sent response to front end
		const {
			_id,
			userName,
			firstName,
			lastName,
			email,
			phone,
			userAvatarUrl,
		} = user;

		return res.json({
			token,
			user: {
				_id,
				userName,
				firstName,
				lastName,
				email,
				phone,
				userAvatarUrl,
			},
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "User Sign Out Successfully",
	});
};

//  Seller Auth
exports.agencySignup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const agency = new Agency(req.body);

	agency.save((err, agency) => {
		if (err) {
			return res.status(400).json({
				error: "Not able to save agency in DataBase",
				msg: err,
			});
		}
		const token = jwt.sign({ _id: agency.id }, process.env.SECRET); // this secret is use later to test isSignin

		// put token in cookie
		res.cookie("token", token, { expire: new Date() + 30 });

		// sent response to front end
		const {
			_id,
			agencyName,
			agencyAvatarUrl,
			email,
			phone,
			isVarified,
		} = agency;
		return res.json({
			token,
			agency: {
				_id,
				agencyName,
				agencyAvatarUrl,
				email,
				phone,
				isVarified,
			},
		});
	});
};

exports.agencySignin = (req, res) => {
	const { email, password } = req.body;

	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	Agency.findOne({ email }, (err, agency) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to find agency in DataBase",
				msg: err,
			});
		} else if (!agency) {
			return res.status(400).json({
				error: "Agency email does not exists",
				msg: err,
			});
		}

		if (!agency.authenticate(password)) {
			return res.status(401).json({
				error: "Email or Password do not match",
				msg: err,
			});
		}

		// create token
		const token = jwt.sign({ _id: agency.id }, process.env.SECRET); // this secret is use later to test isSignin

		// put token in cookie
		res.cookie("token", token, { expire: new Date() + 30 });

		// sent response to front end
		const {
			_id,
			agencyName,
			agencyAvatarUrl,
			email,
			phone,
			isVarified,
		} = agency;
		return res.json({
			token,
			agency: {
				_id,
				agencyName,
				agencyAvatarUrl,
				email,
				phone,
				isVarified,
			},
		});
	});
};

exports.agencySignout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "Agency Sign Out Successfully",
	});
};

/// custom middlewares
/// protected routes

// SignedIn means you can look around peofiles
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	algorithms: ["HS256"],
	userProperty: "auth",
	// auth contains _id in encripted form
});

// authenticate means you can change your profile
exports.isAuthenticated = (req, res, next) => {
	let chacker = req.profile && req.auth && req.profile._id === req.auth._id;
	//   req.profile -> which we created in :userId params
	if (!chacker) {
		return res.status(403).json({
			error: "ACCESS DENIED, You are Not Authenticated",
		});
	}
	next();
};

exports.isAgencyVarified = (req, res, next) => {
	let chacker = req.profile && req.profile.isVarified === 1;
	//   req.profile -> which we created in :userId params
	if (!chacker) {
		return res.status(403).json({
			error: "ACCESS DENIED, You are Not Varified",
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		return res.status(403).json({
			error: "Access Denied, You are not Admin",
		});
	}
	next();
};
