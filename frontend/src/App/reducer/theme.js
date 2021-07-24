import { createMuiTheme } from "@material-ui/core";

import { UPDATE_THEME } from "../action/action-type";

const initialTheme = "dark";

const themes = {
	dark: {
		type: "dark",
		primary: "#a2a2a2",
		secondary: "#959595",
		background: "#333",
		text: { primary: "#f6f6f6", secondary: "#b2b2b2" },
	},
	light: {
		type: "light",
		primary: "#8585ff",
		secondary: "#0000ff",
		background: "#f9f9f9",
		text: { primary: "#000", secondary: "#444" },
	},
	red: {
		type: "light",
		primary: "#ffafaf",
		secondary: "#fa9595",
		background: "#afafaf",
		text: { primary: "#000", secondary: "#444" },
	},
};

let theme = createMuiTheme({
	palette: {
		type: themes[initialTheme].type,

		primary: {
			main: themes[initialTheme].primary,
		},
		secondary: {
			main: themes[initialTheme].secondary,
		},
		background: {
			default: themes[initialTheme].background,
		},
		text: {
			primary: themes[initialTheme].text.primary,
			secondary: themes[initialTheme].text.secondary,
		},
	},
	props: {
		MuiIconButton: { disableRipple: true },
	},
	shape: {
		borderRadius: 10,
	},
});

const updateTheme = (themeName) => {
	theme = createMuiTheme({
		palette: {
			type: themes[themeName].type,

			primary: {
				main: themes[themeName].primary,
			},
			secondary: {
				main: themes[themeName].secondary,
			},
			background: {
				default: themes[themeName].background,
			},
			text: {
				primary: themes[themeName].text.primary,
				secondary: themes[themeName].text.secondary,
			},
		},
		props: {
			MuiIconButton: { disableRipple: true },
		},
	});
};

const themeReducer = (state = theme, action) => {
	switch (action.type) {
		case UPDATE_THEME:
			state = action.payload;
			updateTheme(state);
			return theme;

		default:
			return state;
	}
};

export default themeReducer;

// import { ADD_TODO, REMOVE_TODO } from "../action/action-type";

// const initialState = [];

// export default (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_TODO:
//       return [...state, action.payload];
//     case REMOVE_TODO:
//       return state.filter((todo) => todo.id !== action.payload);

//     default:
//       return state;
//   }
// };
