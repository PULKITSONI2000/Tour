import axios from "axios";

///		User Auth

export const userSignUp = async (user) => {
	try {
		const response = await axios.post(`/api/signup`, user, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("User Signup ERROR : ", error.response);
		return error.response;
	}
};

export const userSignIn = async (user) => {
	try {
		const response = await axios.post(`/api/signin`, user, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("User Signin ERROR : ", error.response);
		return error.response;
	}
};

export const authenticate = (data, next) => {
	// next because it is middleware
	if (typeof window !== "undefined") {
		localStorage.setItem("jwt", JSON.stringify(data));
		next();
	}
}; // for user contineously signin

export const userSignOut = async (next) => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("jwt");
		next();

		try {
			const response = await axios.get(`/api/signout`);
			return response;
		} catch (error) {
			console.error("User Signout ERROR : ", error);
		}
	}
};

export const isAuthenticated = () => {
	if (typeof window == "undefined") {
		return false;
	}
	if (localStorage.getItem("jwt")) {
		return JSON.parse(localStorage.getItem("jwt"));
	} else {
		return false;
	}
};

/// 	 Agency Auth

export const agencySignUp = async (agency) => {
	try {
		const response = await axios.post(`/api/agency/signup`, agency, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Agency Signup ERROR : ", error);
	}
};

export const agencySignIn = async (agency) => {
	try {
		const response = await axios.post(`/api/agency/signin`, agency, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		return response;
	} catch (error) {
		console.error("Agency Signin ERROR : ", error);
	}
};

export const agencySignOut = async (next) => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("jwt");
		next();

		try {
			const response = await axios.get(`/api/agency/signout`);
			return response;
		} catch (error) {
			console.error("Agency Signout ERROR : ", error);
		}
	}
};
