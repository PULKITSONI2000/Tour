import { makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Controls from "../App/components/controls/Controls";

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "calc(100vh - 64px)",
	},
	paper: {
		display: "flex",
		alignItems: "center",
		flexFlow: "column",
		padding: theme.spacing(6),
		minWidth: "50%",
	},
	oops: {
		fontSize: `${theme.spacing(3)}vw`,
		fontWeight: "bold",
		[theme.breakpoints.up("sm")]: {
			fontSize: `${theme.spacing(1.5)}em`,
		},
	},
	notFound: {
		fontSize: `${theme.spacing(0.75)}vw`,
		color: theme.palette.secondary.main,
		[theme.breakpoints.up("md")]: {
			fontSize: `${theme.spacing(0.5)}em`,
		},
	},
	description: {
		// fontSize: `${theme.spacing(0.15)}em`,

		textAlign: "center",
		// [theme.breakpoints.up("md")]: {
		// 	fontSize: `${theme.spacing(0.25)}em`,
		// },
	},
	goBackButton: {
		marginTop: `${theme.spacing(3)}px`,
	},
	/*
		TODO: add description stylees and a button "Back to Home Page"
	 */
}));
const NotFoundPage = () => {
	const classes = useStyles();
	return (
		<div className={classes.root} aria-details="404 Page Not Found">
			<Paper className={classes.paper}>
				<Typography
					variant="h1"
					component="h1"
					color="primary"
					className={classes.oops}
				>
					Oops!
				</Typography>
				<Typography
					variant="caption"
					component="span"
					className={classes.notFound}
				>
					404 Page Not Found
				</Typography>
				<Typography
					variant="subtitle1"
					component="h3"
					className={classes.description}
				>
					The page you are looking for might have been removed, had its name
					changed or is temporarily unavailable.
				</Typography>
				<Link to="/">
					<Controls.Button
						color="primary"
						size="large"
						text="Go Back To HomePage"
						variant="outlined"
						className={classes.goBackButton}
					/>
				</Link>
			</Paper>
		</div>
	);
};

export default NotFoundPage;
