import axios from "axios";
export const getAllTours = async () => {
	try {
		const response = await axios.get(`/api/tours`);
		console.log(response.data);
		return response;
	} catch (error) {
		console.error(error);
	}
};
