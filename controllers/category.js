const Category = require("../models/Category");
const { validationResult } = require("express-validator");
const Tour = require("../models/Tour");

// param
exports.getCategoryById = async (req, res, next, id) => {
	await Category.findById(id).exec((err, category) => {
		if (err) {
			return res.status(400).json({
				error: "Category not found in DataBase",
			});
		}
		req.category = category;
		next();
	});
};

// create a category
exports.createCategory = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}
	const category = new Category(req.body);
	await category.save((err, category) => {
		if (err) {
			return res.status(400).json({
				msg: "Not able to save category in DataBase",
				err: err,
			});
		}
		res.json({ category });
	});
};

// Get a category
exports.getCategory = (req, res) => {
	return res.json(req.category);
};

// get all category
exports.getAllCategory = async (req, res) => {
	await Category.find().exec((err, categories) => {
		if (err) {
			return res.status(400).json({
				error: "No Categories Found in DataBase",
			});
		}
		res.json(categories);
	});
};

// update a category
exports.updateCategory = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	await Category.findByIdAndUpdate(
		{ _id: req.category._id },
		{ $set: req.body }, //update the fields
		{ new: true, usefindAndModify: false }, // compulsary parameter to pass when using .findByIdAndUpdate()
		(err, category) => {
			if (err) {
				return res.status(400).json({
					error: "Not able to update category",
					msg: err,
				});
			}
			res.json(category);
		}
	);
};

// remove a category
exports.removeCategory = async (req, res) => {
	const category = req.category;

	await category.remove((err, category) => {
		if (err) {
			return res.status(400).json({
				error: `Failed to Delete "${req.category.categoryName}" Category`, // can also use ` ` to write name of category
			});
		}
		res.json({
			message: `Successfull Deleted "${category.categoryName}" Category`,
		});
	});
};

// Get All active category
exports.getActiveCategories = async (req, res) => {
	await Tour.distinct(
		"category",
		{
			/* clicks: {$gt: 100} // condition  */
		},
		async (err, activeCategoryIds) => {
			if (err) {
				return res.status(400).json({
					error: "No active category found",
					msg: err,
				});
			}
			await Category.find({ _id: { $in: activeCategoryIds } })
				.select("_id categoryName categoryImageUrl")
				.exec((error, category) => {
					if (error) {
						return res.status(400).json({
							error: `categoriesId not found in categories`,
							msg: err,
						});
					}
					res.json(category);
				});
		}
	);
};
