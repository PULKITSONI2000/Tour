const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1 } = require("uuid");
const { ObjectId } = mongoose.Schema;
const { inboxSchema } = require("./User");

const reviewSchema = new mongoose.Schema(
	{
		userId: {
			type: ObjectId,
			ref: "User",
			required: true,
		},
		review: {
			type: String,
			required: true,
			maxlength: 1024,
			trim: true,
		},
		// dateTime: {
		// 	default: Date,
		// },
	},
	{ timestamps: true }
);
// module.exports = reviewSchema;
// module.exports = mongoose.model("Inbox", reviewSchema);

const certificateSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 128,
		},
		description: {
			type: String,
			maxlength: 1024,
		},
		imageUrl: {
			type: String,
			require: true,
		},
		// dateTime: {
		// 	default: Date,
		// },
	},
	{ timestamps: true }
);
// module.exports = certificateSchema;
// module.exports = mongoose.model("Inbox", certificateSchema);

let agencySchema = new mongoose.Schema(
	{
		// complex data
		tourProvides: [
			{
				type: ObjectId,
				ref: "Tour",
			},
		],

		reviews: [reviewSchema],

		agencyCertifications: [certificateSchema],

		inboxNotification: [inboxSchema],

		bookings: [
			{
				type: ObjectId,
				ref: "booking",
			},
		],

		// normal data
		agencyName: {
			type: String,
			required: true,
			maxlength: 64,
			unique: true,
		},
		agencyOverview: {
			type: String,
			maxlength: 1024,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		phone: {
			type: Number,
			required: true,
			maxlength: 10,
			trim: true,
		},
		agencyAvatarUrl: {
			type: String,
			default: "",
		},

		isVarified: {
			type: Number,
			default: 0,
		},

		// address
		officeAddress: {
			type: String,
			maxlength: 128,
			trim: true,
		},
		city: {
			type: String,
			maxlength: 64,
			trim: true,
		},
		state: {
			type: String,
			maxlength: 32,
			trim: true,
		},
		country: {
			type: String,
			maxlength: 64,
			trim: true,
		},

		// rating: {
		// 	type: Number,
		// 	trim: true,
		// 	default: 0,
		// },

		totalEarning: {
			type: Number,
			trim: true,
			default: 0,
		},

		// Secure fields

		encry_password: {
			type: String,
			required: true,
		},

		salt: String,

		role: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

agencySchema
	.virtual("password")
	.set(function (password) {
		this._password = password;
		this.salt = v1();
		this.encry_password = this.securePassword(password); //password is plainpassword
	})
	.get(function () {
		return this._password;
	});

agencySchema.virtual("rate").set(function (rate) {
	// this._rate = rate;
	this.noOfRating = this.noOfRating + 1;
	this.rating = (this.rating + rate) / this.noOfRating;
});
// .get(function () {
//   return this._rate;
// });

agencySchema.methods = {
	authenticate: function (plainpassword) {
		return this.securePassword(plainpassword) === this.encry_password;
	},

	securePassword: function (plainpassword) {
		if (!plainpassword) return "";
		try {
			return crypto
				.createHmac("sha256", this.salt)
				.update(plainpassword)
				.digest("hex");
		} catch (err) {
			return "";
		}
	},
};

const Agency = mongoose.model("Agency", agencySchema);
module.exports = { Agency, reviewSchema };
