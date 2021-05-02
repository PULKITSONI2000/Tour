const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		categoryName: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
			unique: true,
		},
		categoryDescription: {
			type: String,
			maxlength: 256,
		},
		categoryImageUrl: {
			type: String,
			require: true,
		},
	},
	{ timestamps: true } // makes updateon and createon fields
);

module.exports = mongoose.model("Category", categorySchema);
