import { url } from "./url";

export const getAllCategories = async ({ signal }) => {
	const res = await fetch(`${url}/category`, { signal });
	if (!res.ok)
		throw new Error(`Error getting categories`, {
			cause: res.status,
		});
	return await res.json();
};

export const getCategory = async ({ id }, { signal }) => {
	const res = await fetch(`${url}/category/${id}`, { signal });
	if (!res.ok)
		throw new Error(`Error getting category ${id}`, {
			cause: res.status,
		});
	return await res.json();
};
