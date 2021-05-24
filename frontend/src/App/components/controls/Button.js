import React from "react";
import { Button as MuiButton, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	root: {
		margin: theme.spacing(0.5),
	},
	label: {
		textTransform: "none",
	},
}));

const Button = ({
	text,
	size,
	color,
	variant,
	disabled = false,
	onClick,
	...other
}) => {
	const classes = useStyles();
	return (
		<MuiButton
			variant={variant || "contained"}
			size={size || "large"}
			color={color || "primary"}
			onClick={onClick}
			{...other}
			disabled={disabled}
			classes={{ root: classes.root, label: classes.label }}
			// for other properties
		>
			{text}
		</MuiButton>
	);
};

export default Button;
