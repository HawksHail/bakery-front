import { url } from "./url";

export const getAllCategories = async () => {
	const res = await fetch(`http://${url}/category`);
	return await res.json();
};

export const getCategory = async id => {
	const res = await fetch(`http://${url}/category/${id}`);
	return await res.json();
};
