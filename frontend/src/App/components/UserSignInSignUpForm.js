import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

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
	userSignUp,
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
					confirmPassword: "",
					showPassword: false,
					moreDetails: false,
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

		if ("confirmPassword" in fieldValues) {
			temp.confirmPassword = fieldValues.confirmPassword
				? fieldValues.confirmPassword === values.password
					? ""
					: "Confirm password does not match with Password"
				: "Confirm passwordis required";
		}

		if ("firstName" in fieldValues) {
			temp.firstName = fieldValues.firstName
				? fieldValues.firstName.length < 32 && fieldValues.firstName.length > 3
					? ""
					: "Minimum 3 character and Maximum 32 character required"
				: "This field is required";
		}
		if ("lastName" in fieldValues) {
			temp.lastName = fieldValues.lastName
				? fieldValues.lastName.length < 32 && fieldValues.lastName.length > 3
					? ""
					: "Minimum 3 character and Maximum 32 character required"
				: "This field is required";
		}
		if ("userAvatarUrl" in fieldValues) {
			temp.userAvatarUrl = fieldValues.userAvatarUrl
				? fieldValues.userAvatarUrl.match(/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi)
					? ""
					: "Avatar must be in image format"
				: "";
		}

		if ("email" in fieldValues) {
			temp.email = fieldValues.email
				? fieldValues.email.match(
						/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
				  )
					? ""
					: "Wrong email format"
				: "email is required";
		}
		if ("phone" in fieldValues) {
			temp.phone = fieldValues.phone
				? fieldValues.phone.match(/^(\+[0-9]{2}[-. ])?[0-9]{10}$/gi)
					? ""
					: "Phone Number must be in 10 digit"
				: "phone is required";
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
					: userSignUp({
							...values,
							showPassword: undefined,
							confirmPassword: undefined,
							moreDetails: undefined,
					  });
			result
				.then((response) => {
					if (response.status === 200) {
						authenticate(response.data, () => {
							setRedirect({ didRedirect: true, to: "/dashboard" });
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
			return <Redirect to={redirect.to} />;
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
				{signInSignUp === "Sign In" ? (
					<>
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
					</>
				) : (
					<>
						{/* TODO: add avatar input */}

						<Controls.Input
							label="First Name"
							name="firstName"
							value={values.firstName}
							onChange={handleInputChange}
							error={errors.firstName}
							autoComplete="fname"
						/>
						<Controls.Input
							label="Last Name"
							name="lastName"
							value={values.lastName}
							onChange={handleInputChange}
							error={errors.lastName}
							autoComplete="lname"
						/>
						<Controls.Input
							name="userName"
							label="User Name"
							value={values.userName}
							onChange={handleInputChange}
							error={errors.userName}
							autoComplete="username"
						/>
						<Controls.Input
							name="email"
							label="Email"
							type="email"
							value={values.email}
							onChange={handleInputChange}
							error={errors.email}
							autoComplete="email"
						/>
						<Controls.Input
							name="phone"
							label="Mobile"
							type="tel"
							value={values.phone}
							onChange={handleInputChange}
							error={errors.phone}
							autoComplete="phone"
						/>
						<Controls.Input
							autoComplete="new-password"
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
						<Controls.Input
							autoComplete="new-password"
							label="Confirm Password"
							name="confirmPassword"
							type={values.showPassword ? "text" : "password"}
							value={values.confirmPassword}
							onChange={handleInputChange}
							error={errors.confirmPassword}
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
					</>
				)}

				<Controls.Button
					type="submit"
					text={signInSignUp}
					size="large"
					disabled={!Object.values(errors).every((x) => x === "")}
				/>
			</Form>
			<div>
				<h5>
					Don't have an account?{" "}
					<Link to="/signup" onClick={next}>
						SignUp
					</Link>
				</h5>
			</div>
			<h6>or</h6>
			<div>
				<h5>
					Login as Agency{" "}
					<Link to="/agency/signin" onClick={next}>
						SignIn
					</Link>
				</h5>
			</div>
			<Alert alert={alert} setAlert={setAlert} />
		</>
	);
};

export default UserSignInSignUpForm;
