import { ThemeProvider } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignInPage from "../pages/user/SignInPage";
import BaseLayout from "./components/BaseLayout";

const router = ({ theme }) => {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<BaseLayout>
					<Switch>
						<Route path="/" exact component={HomePage} />
						<Route path="/signin" exact component={SignInPage} />
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
