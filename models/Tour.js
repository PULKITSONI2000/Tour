const mongoose = require("mongoose");
const { reviewSchema } = require("./Agency");

const { ObjectId } = mongoose.Schema;

const tourSchema = new mongoose.Schema(
	{
		providerAgency: {
			type: ObjectId,
			ref: "Agency",
			required: true,
		},
		tourTitle: {
			type: String,
			trim: true,
			required: true,
			maxlength: 200,
		},

		tourOverview: {
			type: String,
			required: true,
			maxlength: 2000,
		},
		// tourPrice: {
		// 	type: Number,
		// 	required: true,
		// 	maxlength: 8,
		// 	trim: true,
		// },
		tourPrice: {
			adult: { type: Number, required: true, maxlength: 8, trim: true },
			child: { type: Number, required: true, maxlength: 8, trim: true },
			infant: { type: Number, required: true, maxlength: 8, trim: true },
		},
		location: {
			type: String,
			maxlength: 128,
		},
		images: [
			{
				type: String,
			},
		],
		itinerary: [
			{
				title: {
					type: String,
					required: true,
				},
				description: {
					type: String,
					maxlength: 256,
				},
				image: {
					type: String,
				},
			},
		],

		highlights: [{ type: String }],

		included: [{ type: String }],

		excluded: [{ type: String }],

		languages: [{ type: String }],

		tourDuration: {
			type: String,
			required: true,
			maxlength: 16,
		},

		coordinates: {
			lat: {
				type: Number,
			},
			long: {
				type: Number,
			},
		},

		faq: [
			{
				q: {
					type: String,
					maxlength: 128,
				},
				ans: {
					type: String,
					maxlength: 256,
				},
			},
		],

		noOfBooking: {
			type: Number,
			default: 0,
		},

		category: {
			type: ObjectId,
			ref: "Category",
			required: true,
		},

		//complex field
		review: [reviewSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tour", tourSchema);

// module.exports = { Review, Product };
