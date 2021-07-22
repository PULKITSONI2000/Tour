import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	paper: {
		padding: theme.spacing(2),
		textAlign: "center",
		color: theme.palette.text.secondary,
	},
}));

const AgencyDetails = () => {
	const classes = useStyles();

	return (
		<div>
			<div className={classes.root}>
				<Grid container spacing={3} direction={"row-reverse"}>
					<Grid item xs={12}>
						<Paper className={classes.paper}>xs=12</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={classes.paper}>xs=6 1</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={classes.paper}>xs=6 2</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3 1</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3 2</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3 3</Paper>
					</Grid>
					<Grid item xs={3}>
						<Paper className={classes.paper}>xs=3 4</Paper>
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default AgencyDetails;
