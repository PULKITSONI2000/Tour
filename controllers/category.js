const Category = require("../models/Category");
const { validationResult } = require("express-validator");

// param
exports.getCategoryById = (req, res, next, id) => {
	Category.findById(id).exec((err, category) => {
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
exports.createCategory = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}
	const category = new Category(req.body);
	category.save((err, category) => {
		if (err) {
			return res.status(400).json({
				error: "Not able to save category in DataBase",
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
exports.getAllCategory = (req, res) => {
	Category.find().exec((err, categories) => {
		if (err) {
			return res.status(400).json({
				error: "No Categories Found in DataBase",
			});
		}
		res.json(categories);
	});
};

// update a category
exports.updateCategory = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array(),
		});
	}

	Category.findByIdAndUpdate(
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
exports.removeCategory = (req, res) => {
	const category = req.category;

	category.remove((err, category) => {
		if (err) {
			return res.status(400).json({
				error: `Failed to Delete ${req.category.categoryName} Category`, // can also use ` ` to write name of category
			});
		}
		res.json({
			message: `Successfull Deleted ${req.category.categoryName} Category`,
		});
	});
};
