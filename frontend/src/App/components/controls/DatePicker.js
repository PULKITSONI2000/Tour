import React from "react";
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const DatePicker = ({
	name,
	label,
	value,
	openTo = "date",
	views = ["year", "month", "date"],
	disableFuture = false,
	animateYearScrolling = false,
	disableToolbar = false,
	onChange,
}) => {
	/**
	 * @description move { name, values } in event.target so that handleInputChange in UseForm can easily read them
	 */
	const convertToDefEventPara = (name, value) => ({
		target: {
			name,
			value,
		},
	});

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<KeyboardDatePicker
				disableToolbar={disableToolbar}
				animateYearScrolling={animateYearScrolling}
				disableFuture={disableFuture}
				openTo={openTo}
				views={views}
				variant="inline"
				inputVariant="outlined"
				orientation="landscape"
				format="dd/MM/yyyy"
				label={label}
				name={name}
				value={value}
				onChange={(date) => onChange(convertToDefEventPara(name, date))}
			/>
		</MuiPickersUtilsProvider>
	);
};

export default DatePicker;
