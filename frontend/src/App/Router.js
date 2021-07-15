import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import SignInPage from "../pages/user/SignInPage";
import SignUpPage from "../pages/user/SignUpPage";
import AgencySignUpPage from "../pages/agency/AgencySignUpPage";
import AgencySignInPage from "../pages/agency/AgencySignInPage";
import BaseLayout from "./components/BaseLayout";
import AgencyDashboard from "../pages/agency/AgencyDashboard";
import { PrivateAgencyRoutes } from "../services/routerServices";

const router = ({ theme }) => {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<BaseLayout>
					<Switch>
						<Route path="/" exact component={HomePage} />
						/// User routes
						<Route path="/signin" exact component={SignInPage} />
						<Route path="/signup" exact component={SignUpPage} />
						/// Agency routes
						<Route path="/agency/signup" exact component={AgencySignUpPage} />
						<Route path="/agency/signin" exact component={AgencySignInPage} />
						<PrivateAgencyRoutes
							path="/agency/dashboard"
							exact
							component={AgencyDashboard}
						/>
						/// Other routes
						<Route component={NotFoundPage} />
					</Switch>
				</BaseLayout>
			</BrowserRouter>
		</ThemeProvider>
	);
};

const mapStateToProps = (state) => ({
	theme: state.theme,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(router);
