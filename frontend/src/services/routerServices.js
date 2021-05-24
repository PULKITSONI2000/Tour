import React from "react";
import { Redirect, Route } from "react-router";
import { isAuthenticated } from "./authServices";

/// 	Agency Routes Protections

export const PrivateAgencyRoutes = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(
				props // for location // can also be destructure as {location}
			) =>
				isAuthenticated() && isAuthenticated().agency ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/agency/signin",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

export const PrivateVarifiedAgencyRoutes = ({
	component: Component,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() && isAuthenticated().agency.isVarified === 1 ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/agency/signin",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

/// 	User Routes Protection

export const PrivateUserRoutes = ({ component: Component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() && isAuthenticated().user ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/signin",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};

/// 	Admin Router Protection

export const AdminRoutes = ({ component: Component, ...rest }) => {
	// component come from routes.js
	return (
		<Route
			{...rest}
			render={(props) =>
				isAuthenticated() && isAuthenticated().agency.role === 100 ? (
					<Component {...props} />
				) : (
					<Redirect
						to={{
							pathname: "/agency/signin",
							state: { from: props.location },
						}}
					/>
				)
			}
		/>
	);
};
