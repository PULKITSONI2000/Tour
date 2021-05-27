import React, { useState } from "react";
import { Redirect } from "react-router-dom";

import { UseForm, Form } from "./UseForm";
import { UseAlert, Alert } from "./UseAlert";
import Controls from "./controls/Controls";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
	IconButton,
	InputAdornment,
	makeStyles,
	Typography,
} from "@material-ui/core";
import {
	authenticate,
	isAuthenticated,
	userSignIn,
} from "../../services/authServices";

const useStyles = makeStyles((theme) => ({
	typographyRoot: {
		marginBottom: theme.spacing(3),
	},
}));

const UserSignInSignUpForm = ({ signInSignUp, next = () => {} }) => {
	const classes = useStyles();
	const [redirect, setRedirect] = useState({ didRedirect: false, to: "/" });

	const initialFValues =
		signInSignUp === "Sign In"
			? {
					userName: "",
					password: "",
					showPassword: false,
			  }
			: {
					userName: "",
					firstName: "",
					lastName: "",
					phone: "",
					email: "",
					userAvatarUrl: "",
					password: "",
					showPassword: false,
			  };

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
		if ("userName" in fieldValues) {
			temp.userName = fieldValues.userName
				? fieldValues.userName.length < 64 && fieldValues.userName.length > 3
					? ""
					: "Minimum 3 character and Maximum 64 character required"
				: "This field is required";
		}
		if ("password" in fieldValues) {
			temp.password =
				fieldValues.password.length >= 6
					? /[a-z]/g.test(fieldValues.password)
						? /[A-Z]/g.test(fieldValues.password)
							? /[0-9]/g.test(fieldValues.password)
								? /[!$@#%&*()\-_)\\/?<>]/g.test(fieldValues.password)
									? ""
									: "Password must contain at least one symbolic character"
								: "Password must contain at least one Numeric digit"
							: "Password must contain at least one capital letter "
						: "Password must contain at least one small letter"
					: "Password must be 6 digit long";
		}
		setErrors({
			...temp,
		});
		if (fieldValues === values) {
			return Object.values(temp).every((x) => x === "");
		}
	};
	const { values, setValues, errors, setErrors, handleInputChange } = UseForm(
		initialFValues,
		true,
		validate
	);
	const { alert, setAlert } = UseAlert();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			const result =
				signInSignUp === "Sign In"
					? userSignIn({ ...values, showPassword: undefined })
					: "";
			/*
						TODO: signUP page is panding
					 */

			result
				.then((response) => {
					if (response.status === 200) {
						authenticate(response.data, () => {
							setRedirect({ didRedirect: true, to: "/" });
							next();
						});
					} else {
						setAlert({
							...alert,
							open: true,
							message: response.data.msg,
							severity: "error",
						});
					}
				})
				.catch((err) => {
					console.error("Error", err);
				});
		}
	};

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const performRedirect = () => {
		if (isAuthenticated()) {
			return <Redirect to="/" />;
		}
		if (redirect.didRedirect) {
			return <Redirect to={redirect.to} />;
		}
	};
	return (
		<>
			{performRedirect()}
			<Form onSubmit={handleSubmit} autoComplete="off">
				<Typography
					variant="h3"
					component="h1"
					className={classes.typographyRoot}
				>
					{signInSignUp}
				</Typography>
				<Controls.Input
					name="userName"
					label="User Name"
					value={values.userName}
					onChange={handleInputChange}
					error={errors.userName}
					autoComplete="username"
				/>
				<Controls.Input
					autoComplete="current-password"
					label="Password"
					name="password"
					type={values.showPassword ? "text" : "password"}
					value={values.password}
					onChange={handleInputChange}
					error={errors.password}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{values.showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
				<Controls.Button
					type="submit"
					text={signInSignUp}
					size="large"
					disabled={!Object.values(errors).every((x) => x === "")}
				/>
			</Form>
			<Alert alert={alert} setAlert={setAlert} />
		</>
	);
};

export default UserSignInSignUpForm;
