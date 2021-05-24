import { UPDATE_THEME } from "./action-type";

export const updateTheme = (theme) => ({
	type: UPDATE_THEME,
	payload: theme,
});
