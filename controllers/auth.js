const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const { validationResult } = require("express-validator");

const { User } = require("../models/User");
const { Agency } = require("../models/Agency");

//  User Auth
exports.signup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}
	if (!req.body.userAvatarUrl) {
		req.body.userAvatarUrl = req.body.firstName
			.trim()[0]
			.toLowerCase()
			.match(/^[a-zA-Z]$/g)
			? `https://botanica.gallery/wp/wp-content/plugins/buddypress-first-letter-avatar/images/roboto/128/latin_${req.body.firstName
					.trim()[0]
					.toLowerCase()}.png`
			: "https://botanica.gallery/wp/wp-content/plugins/buddypress-first-letter-avatar/images/roboto/128/mystery.png";
	}

	var user = new User(req.body);
	user.save(
		(err, user) => {
			if (err) {
				return res.status(400).json({
					msg: "Not able to save user in DataBase",
					error: err,
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
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	User.findOne({ userName: userName }, (err, user) => {
		if (err) {
			return res.status(400).json({
				msg: "Unable to find user in DataBase",
				error: err,
			});
		} else if (!user) {
			return res.status(400).json({
				msg: "UserName does not exists",
			});
		}

		if (!user.authenticate(password)) {
			return res.status(401).json({
				msg: "UserName/Password does not match",
			});
		}

		// create token
		const token = jwt.sign({ _id: user.id }, process.env.SECRET); // this secret is use later to test isSignin

		// put token in cookie
		res.cookie("token", token, { expire: new Date() + 30 });

		// sent response to front end
		const { _id, userName, firstName, lastName, email, phone, userAvatarUrl } =
			user;

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
		msg: "User Sign Out Successfully",
	});
};

//  Agency Auth
exports.agencySignup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}
	if (!req.body.agencyAvatarUrl) {
		req.body.agencyAvatarUrl = req.body.agencyName
			.trim()[0]
			.toLowerCase()
			.match(/^[a-zA-Z]$/g)
			? `https://botanica.gallery/wp/wp-content/plugins/buddypress-first-letter-avatar/images/roboto/128/latin_${req.body.agencyName
					.trim()[0]
					.toLowerCase()}.png`
			: "https://botanica.gallery/wp/wp-content/plugins/buddypress-first-letter-avatar/images/roboto/128/mystery.png";
	}

	const agency = new Agency(req.body);

	agency.save((err, agency) => {
		if (err) {
			return res.status(400).json({
				msg: "Not able to save agency in DataBase",
				error: err,
			});
		}
		const token = jwt.sign({ _id: agency.id }, process.env.SECRET); // this secret is use later to test isSignin

		// put token in cookie
		res.cookie("token", token, { expire: new Date() + 30 });

		// sent response to front end
		const { _id, agencyName, agencyAvatarUrl, email, phone, isVarified } =
			agency;
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
			error: errors.array(),
			// error: errors.array()[0].msg,
		});
	}

	Agency.findOne({ email }, (err, agency) => {
		if (err) {
			return res.status(400).json({
				msg: "Unable to find agency in DataBase",
				error: err,
			});
		} else if (!agency) {
			return res.status(400).json({
				msg: "Agency email does not found in Database",
				error: "No Agency found",
			});
		}

		if (!agency.authenticate(password)) {
			return res.status(401).json({
				msg: "Email or Password do not match",
				error: err,
			});
		}

		// create token
		const token = jwt.sign({ _id: agency.id }, process.env.SECRET); // this secret is use later to test isSignin

		// put token in cookie
		res.cookie("token", token, { expire: new Date() + 30 });

		// sent response to front end
		const { _id, agencyName, agencyAvatarUrl, email, phone, isVarified } =
			agency;
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
		msg: "Agency Sign Out Successfully",
	});
};

// custom middlewares
// protected routes

// SignedIn means you can look around peofiles
/**
 * checks is user/ agency SignedIn
 */
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	algorithms: ["HS256"],
	userProperty: "auth",
	// auth contains _id in encripted form
});

// authenticate means you can change your profile
/**
 * checks for Authentication
 * @requires param like :userId | :agencyId
 */
exports.isAuthenticated = (req, res, next) => {
	let chacker = req.profile && req.auth && req.profile._id == req.auth._id;
	//   req.profile -> which we created in :userId params
	if (!chacker) {
		return res.status(403).json({
			error: "ACCESS DENIED, You are Not Authenticated",
		});
	}
	next();
};

/**
 * check for Agency Varification
 * @requires isVarified === 1
 */
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

/**
 * check for Admin
 * @requires role === 100 for admin
 */
exports.isAdmin = (req, res, next) => {
	if (req.profile.role !== 100) {
		return res.status(403).json({
			error: "Access Denied, You are not Admin",
		});
	}
	next();
};
