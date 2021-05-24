import React from "react";
import "./App.css";
import { CssBaseline } from "@material-ui/core";
import Router from "./Router";

//redux
import { Provider } from "react-redux";
import store from "./store";

function App() {
	// const classes = useStyles();

	return (
		<Provider store={store}>
			<CssBaseline />
			{/* <Paper>
				<Typography>Sample Text </Typography>
			</Paper>
				
			<Button onClick={(e) => setDarkState("dark")}>Dark</Button>
			<Button onClick={(e) => setDarkState("light")}>light</Button>
			<Button onClick={(e) => setDarkState("red")}>Red</Button>
			<Switch
				color="primary"
				onClick={() => {
					console.log("hi");
				}}
			/> */}
			<Router />
		</Provider>
	);
}

export default App;
