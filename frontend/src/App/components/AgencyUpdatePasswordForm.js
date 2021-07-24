import { Grid, IconButton, InputAdornment } from "@material-ui/core";
import React from "react";
import { updateAgencyPassword } from "../../services/agecnyServices";
import Controls from "./controls/Controls";
import { Alert, UseAlert } from "./UseAlert";
import { Form, UseForm } from "./UseForm";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const AgencyUpdatePasswordForm = ({ token, agencyId }) => {
	const initialFValues = {
		oldPassword: "",
		password: "",
		confirmPassword: "",
		showPassword: false,
	};

	const validate = (fieldValues = values) => {
		let temp = { ...errors };
		if ("oldPassword" in fieldValues) {
			temp.oldPassword =
				fieldValues.oldPassword.length >= 6
					? /[a-z]/g.test(fieldValues.oldPassword)
						? /[A-Z]/g.test(fieldValues.oldPassword)
							? /[0-9]/g.test(fieldValues.oldPassword)
								? /[!$@#%&*()\-_)\\/?<>]/g.test(fieldValues.oldPassword)
									? ""
									: "Old Password must contain at least one symbolic character"
								: "Old Password must contain at least one Numeric digit"
							: "Old Password must contain at least one capital letter "
						: "Old Password must contain at least one small letter"
					: "Old Password must be 6 digit long";
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

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			if (validate()) {
				const result = await updateAgencyPassword(
					agencyId,
					{
						oldPassword: values.oldPassword,
						newPassword: values.password,
						showPassword: undefined,
						confirmPassword: undefined,
					},
					token
				);
				if (result.status !== 200) {
					throw Object.assign(new Error(result.statusText), {
						status: result.status,
						err: result,
					});
				} else {
					setAlert({
						...alert,
						open: true,
						message: result.data.msg,
						severity: "success",
					});
				}
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

	return (
		<Form onSubmit={handleSubmit} autoComplete="off">
			<Grid container>
				<Grid item sm={12} md={6}>
					<Grid container direction="column" alignItems="center">
						<Controls.Input
							label="Old Password*"
							autoComplete="office password"
							name="oldPassword"
							type={values.showPassword ? "text" : "password"}
							value={values.oldPassword}
							onChange={handleInputChange}
							error={errors.oldPassword}
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
							label="New Password*"
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
											{values.showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
				</Grid>
				<Grid item sm={12} md={6}>
					<Grid container direction="column" alignItems="center">
						<Controls.Input
							label="Confirm New Password*"
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
											{values.showPassword ? <Visibility /> : <VisibilityOff />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<Controls.Button
							type="submit"
							text={"Update Password"}
							size="large"
							disabled={!Object.values(errors).every((x) => x === "")}
						/>
					</Grid>
				</Grid>
			</Grid>

			<Alert alert={alert} setAlert={setAlert} />
		</Form>
	);
};

export default AgencyUpdatePasswordForm;
