import { createStore, combineReducers } from "redux";

import theme from "./reducer/theme";

const rootReducer = combineReducers({
	theme,
});

const store = createStore(rootReducer);

export default store;
