import { Grid } from "@material-ui/core";
import React from "react";
import { updateAgency } from "../../services/agecnyServices";
import Controls from "./controls/Controls";
import { Alert, UseAlert } from "./UseAlert";
import { Form, UseForm } from "./UseForm";

const AgencyUpdateDetailsForm = ({
	initialFValues = {
		agencyName: "",
		agencyOverview: "",
		email: "",
		phone: "",
		officeAddress: "",
		city: "",
		state: "",
		country: "",
	},
	token,
	agencyId,
}) => {
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
		if ("agencyOverview" in fieldValues) {
			temp.agencyOverview = fieldValues.agencyOverview
				? fieldValues.agencyOverview.length < 1024 &&
				  fieldValues.agencyOverview.length > 8
					? ""
					: "Minimum 8 character and Maximum 1024 character required"
				: "This field is required";
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
				? String(fieldValues.phone).match(/^(\+[0-9]{2}[-. ])?[0-9]{10}$/gi)
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

	const { values, errors, setErrors, handleInputChange } = UseForm(
		initialFValues,
		true,
		validate
	);
	const { alert, setAlert } = UseAlert();

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			if (validate()) {
				const result = await updateAgency(agencyId, values, token);
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
					<Grid
						container
						direction="column"
						alignItems="center"
						justify="space-between"
					>
						<Controls.Input
							name="agencyName"
							label="Agency Name*"
							value={values.agencyName}
							onChange={handleInputChange}
							error={errors.agencyName}
							autoComplete="office username"
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
					</Grid>
				</Grid>
				<Grid item sm={12} md={6}>
					<Grid
						container
						direction="column"
						alignItems="center"
						justify="space-between"
					>
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
						<Controls.Button
							type="submit"
							text={"Update"}
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

export default AgencyUpdateDetailsForm;
