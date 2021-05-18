import React, { useMemo, useState } from "react";
import "./App.css";
import {
	Button,
	createMuiTheme,
	CssBaseline,
	ThemeProvider,
	useMediaQuery,
} from "@material-ui/core";
import {
	deepOrange,
	deepPurple,
	lightBlue,
	orange,
	red,
} from "@material-ui/core/colors";

// const useStyles = makeStyles((theme) => ({
// 	app: {
// 		backgroundColor: theme.palette.background,
// 		color: theme.palette.primary.main,
// 	},
// }));

function App() {
	const [darkState, setDarkState] = useState(
		useMediaQuery("(prefers-color-scheme: dark)") ? "dark" : "light"
	);

	const darkTheme = useMemo(() => {
		const themes = {
			primary: {
				dark: orange[500],
				light: lightBlue[500],
				red: red[500],
			},
			secondary: {
				dark: deepOrange[900],
				light: deepPurple[500],
				red: orange[500],
			},
			background: {
				dark: "#030303",
				light: "#f9f9f9",
				red: orange[100],
			},
		};
		return createMuiTheme({
			palette: {
				type:
					darkState === "dark" || darkState === "light" ? darkState : "light",
				primary: {
					main: themes.primary[darkState],
					// darkState === "dark" ? orange[500] : lightBlue[500],
				},
				secondary: {
					main: themes.secondary[darkState],
					// darkState === "dark" ? deepOrange[900] : deepPurple[500],
				},
				background: {
					default: themes.background[darkState],
				},
			},
		});
	}, [darkState]);

	return (
		<ThemeProvider theme={darkTheme}>
			<div style={{ backgroundColor: "primary.main" }}> Sample Text </div>
			<Button onClick={(e) => setDarkState("dark")}>Dark</Button>
			<Button onClick={(e) => setDarkState("light")}>light</Button>
			<Button onClick={(e) => setDarkState("red")}>Red</Button>
			<CssBaseline />
		</ThemeProvider>
	);
}

export default App;
