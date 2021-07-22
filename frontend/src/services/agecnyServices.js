import axios from "axios";

export const getAgency = async (agencyId) => {
	try {
		const response = await axios.get(`/api/agency/${agencyId}`);
		return response;
	} catch (error) {
		console.error("Get Agency ERROR : ", error.response);
		return error.response;
	}
};

export const updateAgency = async (agencyId, agency, token) => {
	try {
		const response = await axios.put(`/api/agency/update/${agencyId}`, agency, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response;
	} catch (error) {
		console.error("Update Agency ERROR : ", error.response);
		return error.response;
	}
};

export const updateAgencyPassword = async (
	agencyId,
	agencyPasswords,
	token
) => {
	try {
		const response = await axios.put(
			`/api/agency/update/password/${agencyId}`,
			agencyPasswords,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	} catch (error) {
		console.error("Update Agency Password ERROR : ", error.response);
		return error.response;
	}
};

export const updateAgencyAvatar = async (agencyId, agencyAvatar, token) => {
	try {
		const response = await axios.put(
			`/api/agency/update/avatar/${agencyId}`,
			agencyAvatar,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	} catch (error) {
		console.error("Update Agency Avatar ERROR : ", error.response);
		return error.response;
	}
};

export const getAgencyInbox = async (agencyId, token) => {
	try {
		const response = await axios.get(`/api/agency/inbox/${agencyId}`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response;
	} catch (error) {
		console.error("Get Agency Inbox ERROR : ", error.response);
		return error.response;
	}
};

export const getAgencyCertificate = async (agencyId, token) => {
	try {
		const response = await axios.get(`/api/agency/certificates/${agencyId}`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response;
	} catch (error) {
		console.error("Get Agency Certificate ERROR : ", error.response);
		return error.response;
	}
};

export const addAgencyCertificate = async (
	agencyId,
	agencyCertificate,
	token
) => {
	try {
		const response = await axios.post(
			`/api/agency/certificates/add/${(agencyId, token)}`,
			agencyCertificate,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	} catch (error) {
		console.error("Add Agency Certificate ERROR : ", error.response);
		return error.response;
	}
};

export const deleteAgencyCertificate = async (agencyId, token) => {
	try {
		const response = await axios.delete(
			`/agency/certificates/remove/${agencyId}`,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response;
	} catch (error) {
		console.error("Get Agency Certificate ERROR : ", error.response);
		return error.response;
	}
};

export const getAgencyBooking = async (agencyId, token) => {
	try {
		const response = await axios.get(`/api/agency/Booking/${agencyId}`, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});
		return response;
	} catch (error) {
		console.error("Get Agency Booking ERROR : ", error.response);
		return error.response;
	}
};
