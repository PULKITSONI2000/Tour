import { makeStyles } from "@material-ui/core";
import React from "react";
import Header from "./Header";

const useStyles = makeStyles((theme) => ({
	root: {
		backgroundColor: theme.palette.background.default,
		color: theme.palette.text.primary,
	},
}));

const BaseLayout = ({ children }) => {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Header />

			{children}
		</div>
	);
};

export default BaseLayout;
