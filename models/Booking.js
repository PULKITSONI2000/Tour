const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const BookingSchema = new mongoose.Schema(
	{
		transaction_id: {},

		totalAmount: {
			type: Number,
			trim: true,
			required: true,
		},

		status: {
			type: String,
			default: "Booked",
			enum: ["Cancelled", "Completed", "Booked", "OnGoing"],
		},

		bookedOn: Date,

		startingDate: {
			type: Date,
			require: true,
		},
		endingDate: {
			type: Date,
			require: true,
		},
		// objectid fields
		tourists: [
			{
				type: ObjectId,
				ref: "User",
			},
		],

		agencyId: {
			type: ObjectId,
			ref: "Agency",
			required: true,
		},
		tourId: {
			type: ObjectId,
			ref: "Agency",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Booking", OrderSchema);
