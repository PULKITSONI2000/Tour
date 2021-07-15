import React, { useState } from "react";
import {
	IconButton,
	InputAdornment,
	makeStyles,
	Typography,
} from "@material-ui/core";
import { Alert, UseAlert } from "./UseAlert";
import { Form, UseForm } from "./UseForm";
import {
	agencySignIn,
	agencySignUp,
	authenticate,
	isAuthenticated,
} from "../../services/authServices";
import { Link, Redirect } from "react-router-dom";
import Controls from "./controls/Controls";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
	typographyRoot: {
		marginBottom: theme.spacing(3),
	},
	formNav: {
		marginTop: theme.spacing(3),
		display: "flex",
		justifyContent: "space-around",
		flexDirection: "column",
		alignItems: "center",
		"& h4": {
			margin: `${theme.spacing(0.5)}px 0px`,
		},
		"& h6": {
			margin: "0px",
		},
		"& a": {
			color: theme.palette.primary.main,
			marginLeft: theme.spacing(1),
		},
	},
	nameFields: {
		width: "100%",
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		flexFlow: "column",
		margin: theme.spacing(0),
		[theme.breakpoints.up("lg")]: {
			margin: theme.spacing(2),
			alignItems: "stretch",
			width: "80%",
			flexFlow: "row",
			"& .MuiFormControl-root": { margin: theme.spacing(0), width: "48%" },
		},
	},
}));

const AgencySignInSignUp = ({ signInSignUp, next = () => {} }) => {
	const classes = useStyles();
	const [redirect, setRedirect] = useState({ didRedirect: false, to: "/" });

	const initialFValues =
		signInSignUp === "Sign In"
			? {
					email: "",
					password: "",
					showPassword: false,
			  }
			: {
					agencyName: "",
					agencyOverview: "",
					agencyAvatarUrl: "",
					password: "",
					confirmPassword: "",
					showPassword: false,
					moreDetails: false,
					email: "",
					phone: "",
					officeAddress: "",
					city: "",
					state: "",
					country: "",
			  };

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
		if ("agencyName" in fieldValues) {
			temp.agencyName = fieldValues.agencyName
				? fieldValues.agencyName.length < 64 &&
				  fieldValues.agencyName.length > 3
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
		if ("agencyOverview" in fieldValues) {
			temp.agencyOverview = fieldValues.agencyOverview
				? fieldValues.agencyOverview.length < 1024 &&
				  fieldValues.agencyOverview.length > 8
					? ""
					: "Minimum 8 character and Maximum 1024 character required"
				: "This field is required";
		}
		if ("agencyAvatarUrl" in fieldValues) {
			temp.agencyAvatarUrl = fieldValues.agencyAvatarUrl
				? fieldValues.agencyAvatarUrl.match(
						/\w+\.(jpg|jpeg|gif|png|tiff|bmp)$/gi
				  )
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

		if ("officeAddress" in fieldValues) {
			temp.officeAddress = fieldValues.officeAddress
				? fieldValues.officeAddress.length < 128 &&
				  fieldValues.officeAddress.length > 8
					? ""
					: "Minimum 8 character and Maximum 128 character required"
				: "";
		}
		if ("city" in fieldValues) {
			temp.city = fieldValues.city
				? fieldValues.city.length < 64 && fieldValues.city.length > 3
					? ""
					: "Minimum 8 character and Maximum 128 character required"
				: "";
		}
		if ("state" in fieldValues) {
			temp.state = fieldValues.state
				? fieldValues.state.length < 32 && fieldValues.state.length > 3
					? ""
					: "Minimum 8 character and Maximum 128 character required"
				: "";
		}
		if ("country" in fieldValues) {
			temp.country = fieldValues.country
				? fieldValues.country.length < 64 && fieldValues.country.length > 3
					? ""
					: "Minimum 8 character and Maximum 128 character required"
				: "";
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

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			if (validate()) {
				const result =
					signInSignUp === "Sign In"
						? await agencySignIn({ ...values, showPassword: undefined })
						: await agencySignUp({
								...values,
								showPassword: undefined,
								confirmPassword: undefined,
								moreDetails: undefined,
						  });

				if (result.status !== 200) {
					throw Object.assign(new Error(result.statusText), {
						status: result.status,
						err: result,
					});
				}
				authenticate(result.data, () => {
					setRedirect({ didRedirect: true, to: "/agency/dashboard" });
					next();
				});
			}
		} catch (result) {
			const { status, err } = result;
			switch (status) {
				case 422:
					let msg = "Please Check - ";
					err.data.error.forEach((e) => {
						msg += `\n\t${e.param} : ${e.msg},`;
						// setErrors({ ...errors, [e.param]: e.msg });
					});

					setAlert({
						...alert,
						open: true,
						message: msg,
						severity: "error",
					});
					break;
				case 400:
					setAlert({
						...alert,
						open: true,
						message:
							typeof err.data.error === "string"
								? `${err.data.error} : ${err.data.msg}`
								: `${err.data.msg}${
										!!err.data.error
											? `, please change ${Object.keys(
													err.data.error.keyValue
											  ).join()}`
											: ""
								  }`,
						severity: "error",
					});
					break;
				case 401:
					setAlert({
						...alert,
						open: true,
						message: err.data.msg,
						severity: "error",
					});
					break;
				default:
					setAlert({
						...alert,
						open: true,
						message:
							"Something went wrong from our side please tell us in feedback",
						severity: "error",
					});
					break;
			}
		}
	};

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};
	const handleMoreDetaila = (e) => {
		e.preventDefault();
		setValues({ ...values, moreDetails: !values.moreDetails });
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
							name="email"
							label="Email ID"
							value={values.email}
							onChange={handleInputChange}
							error={errors.email}
							autoComplete="office email"
						/>
						<Controls.Input
							autoComplete="office current-password"
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
						{!values.moreDetails ? (
							<>
								<Controls.Input
									name="agencyName"
									label="Agency Name*"
									value={values.agencyName}
									onChange={handleInputChange}
									error={errors.agencyName}
									autoComplete="office username"
								/>

								<Controls.Input
									label="Password*"
									autoComplete="office new-password"
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
													{values.showPassword ? (
														<Visibility />
													) : (
														<VisibilityOff />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<Controls.Input
									label="Confirm Password*"
									autoComplete="office new-password"
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
													{values.showPassword ? (
														<Visibility />
													) : (
														<VisibilityOff />
													)}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<Controls.Input
									name="agencyOverview"
									label="Agency Overview*"
									value={values.agencyOverview}
									onChange={handleInputChange}
									error={errors.agencyOverview}
									autoComplete="office overview"
									multiline
									rows={5}
								/>
							</>
						) : (
							<>
								<Controls.Input
									name="email"
									label="Email*"
									type="email"
									value={values.email}
									onChange={handleInputChange}
									error={errors.email}
									autoComplete="office email"
								/>
								<Controls.Input
									name="phone"
									label="Mobile*"
									type="tel"
									value={values.phone}
									onChange={handleInputChange}
									error={errors.phone}
									autoComplete="office phone"
								/>
								<Controls.Input
									name="officeAddress"
									label="Office Address"
									value={values.officeAddress}
									onChange={handleInputChange}
									error={errors.officeAddress}
									autoComplete="office street-address work"
								/>
								<Controls.Input
									name="city"
									label="City"
									value={values.city}
									onChange={handleInputChange}
									error={errors.city}
									autoComplete="office city work"
								/>
								<Controls.Input
									name="state"
									label="State"
									value={values.state}
									onChange={handleInputChange}
									error={errors.state}
									autoComplete="office state work"
								/>
								<Controls.Input
									name="country"
									label="Country"
									value={values.country}
									onChange={handleInputChange}
									error={errors.country}
									autoComplete="office country work"
								/>

								{/* <Controls.RadioGroup
									name="gender"
									label="Gender"
									value={values.gender}
									onChange={handleInputChange}
									items={genderItems}
								/> */}
							</>
						)}
					</>
				)}
				<div>
					{signInSignUp === "Sign In" ? (
						<Controls.Button
							type="submit"
							text={signInSignUp}
							size="large"
							disabled={!Object.values(errors).every((x) => x === "")}
						/>
					) : values.moreDetails ? (
						<>
							<Controls.Button
								type="button"
								text="< Prev"
								size="large"
								onClick={handleMoreDetaila}
							/>
							<Controls.Button
								type="submit"
								text={signInSignUp}
								size="large"
								disabled={!Object.values(errors).every((x) => x === "")}
							/>
						</>
					) : (
						<Controls.Button
							type="button"
							text="Next >"
							size="large"
							onClick={handleMoreDetaila}
						/>
					)}
				</div>
			</Form>
			<div className={classes.formNav}>
				{signInSignUp === "Sign In" ? (
					<>
						<Typography variant="subtitle1" component="h4">
							Don't have an account?
							<Link to="/agency/signup" onClick={next}>
								SignUp
							</Link>
						</Typography>
						<h6>or</h6>
						<Typography variant="subtitle1" component="h4">
							Sign in as User
							<Link to="/signin" onClick={next}>
								SignIn
							</Link>
						</Typography>
					</>
				) : (
					<Typography variant="subtitle1" component="h4">
						Already have an account?
						<Link to="/agency/signin" onClick={next}>
							Sign In
						</Link>
					</Typography>
				)}
			</div>
			<Alert alert={alert} setAlert={setAlert} />
		</>
	);
};

export default AgencySignInSignUp;
