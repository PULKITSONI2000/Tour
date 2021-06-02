import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import SignInPage from "../pages/user/SignInPage";
import SignUpPage from "../pages/user/SignUpPage";
import BaseLayout from "./components/BaseLayout";

const router = ({ theme }) => {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<BaseLayout>
					<Switch>
						<Route path="/" exact component={HomePage} />
						<Route path="/signin" exact component={SignInPage} />
						<Route path="/signup" exact component={SignUpPage} />
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
