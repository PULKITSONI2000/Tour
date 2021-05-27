import React, { useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
}));

const UseAlert = (
	initialAlert = {
		open: false,
		message: "",
		autoHideDuration: 5000,
		variant: "filled",
		severity: "success",
	}
) => {
	const [alert, setAlert] = useState(initialAlert);

	return { alert, setAlert };
};

const Alert = ({ alert, setAlert }) => {
	const classes = useStyles();
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setAlert({ ...alert, open: false });
	};
	return (
		<div className={classes.root}>
			<Snackbar
				open={alert.open}
				autoHideDuration={alert.autoHideDuration}
				onClose={handleClose}
			>
				<MuiAlert
					elevation={6}
					variant={alert.variant}
					onClose={handleClose}
					severity={alert.severity}
				>
					{alert.message}
				</MuiAlert>
			</Snackbar>
		</div>
	);
};

export { UseAlert, Alert };
