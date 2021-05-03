const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1 } = require("uuid");
const { ObjectId } = mongoose.Schema;

// MessageSchema
const inboxSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			maxlength: 256,
		},
		message: {
			type: String,
			required: true,
			maxlength: 1024,
		},
		// dateTime: {
		// 	default: Date,
		// },
	},
	{ timestamps: true }
);
// module.exports = inboxSchema;
// module.exports = mongoose.model("Inbox", inboxSchema);

const userSchema = new mongoose.Schema(
	{
		// complex fields
		inboxNotification: [inboxSchema],
		bookingHistory: [
			{
				type: ObjectId,
				ref: "Booking",
			},
		],

		// normal fields

		userName: {
			type: String,
			required: true,
			maxlength: 64,
			unique: true,
		},
		firstName: {
			type: String,
			required: true,
			maxlength: 32,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			maxlength: 32,
			trim: true,
		},
		userAvatarUrl: {
			type: String,
			default: "",
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

		// address
		address: {
			type: String,
			maxlength: 128,
		},
		city: {
			type: String,
			maxlength: 32,
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

		gender: {
			type: String,
			maxlength: 8,
			trim: true,
			require: true,
		},
		dob: {
			type: Date,
		},

		// Secure fields

		encry_password: {
			type: String,
			required: true,
		},

		salt: String,
	},
	{ timestamps: true }
);

userSchema
	.virtual("password")
	.set(function (password) {
		this._password = password;
		this.salt = v1();
		this.encry_password = this.securePassword(password); //password is plainpassword
	})
	.get(function () {
		return this._password;
	});

userSchema.methods = {
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
const User = mongoose.model("User", userSchema);
module.exports = { User, inboxSchema };
