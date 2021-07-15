import { Container, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import AgencySignInSignUpForm from "../../App/components/AgencySignInSignUpForm";

const useStyles = makeStyles((theme) => ({
	paperRoot: {
		padding: theme.spacing(6),
		minWidth: "50%",
	},
	containerRoot: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		minHeight: "calc(100vh - 64px)",
	},
}));

const SignInPage = () => {
	const classes = useStyles();
	return (
		<Container className={classes.containerRoot}>
			<Paper className={classes.paperRoot}>
				<AgencySignInSignUpForm signInSignUp="Sign In" />
			</Paper>
		</Container>
	);
};

export default SignInPage;
