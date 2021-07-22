export const notifyAgency = async (adminId, message, token) => {
	try {
		const response = await axios.post(
			`/api/agency/inbox/notify/${adminId}`,
			message,
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
		console.error("Notify Agency ERROR : ", error.response);
		return error.response;
	}
};
