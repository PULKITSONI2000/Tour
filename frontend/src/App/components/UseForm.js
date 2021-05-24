import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";

const UseForm = (initialFValues, validateOnChange = false, validate) => {
	const [values, setValues] = useState(initialFValues);
	const [errors, setErrors] = useState({});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setValues({
			...values,
			[name]: value,
		});
		if (validateOnChange) {
			validate({ [name]: value });
		}
	};

	const resetForm = () => {
		setValues(initialFValues);
		setErrors({});
	};

	return {
		values,
		setValues,
		errors,
		setErrors,
		handleInputChange,
		resetForm,
	};
};

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-around",
		alignItems: "center",
		// minHeight: "100%",

		"& .MuiFormControl-root": { margin: theme.spacing(2), width: "80%" },
	},
}));

const Form = ({ children, autoComplete = "off", ...other }) => {
	const classes = useStyles();
	return (
		<form className={classes.root} autoComplete={autoComplete} {...other}>
			{children}
		</form>
	);
};

export { UseForm, Form };
