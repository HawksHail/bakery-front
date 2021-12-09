import { url } from "./url";

export const getAllSuppliers = async ({ signal }) => {
	const res = await fetch(`${url}/supplier`, { signal });
	if (!res.ok)
		throw new Error(`Error getting suppliers`, {
			cause: res.status,
		});
	return await res.json();
};

export const getSupplier = async ({ id }, { signal }) => {
	const res = await fetch(`${url}/supplier/${id}`, { signal });
	if (!res.ok)
		throw new Error(`Error getting supplier ${id}`, {
			cause: res.status,
		});
	return await res.json();
};
