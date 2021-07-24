import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	ContainerRoot: {
		marginTop: theme.spacing(4),
		[theme.breakpoints.down("lg")]: {
			maxWidth: "95%",
		},
	},
}));

const AgencyDetails = ({ drawer, setDrawer }) => {
	const classes = useStyles();
	{
		console.log("Edit", drawer);
	}
	return (
		<Container maxWidth="lg" className={classes.ContainerRoot}>
			<div></div>
		</Container>
	);
};

export default AgencyDetails;
