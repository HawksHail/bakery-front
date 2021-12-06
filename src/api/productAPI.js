import { url } from "./url";

export const getAllProducts = async ({ signal }) => {
	const res = await fetch(`${url}/product`, { signal });
	if (!res.ok)
		throw new Error(`Error getting products`, {
			cause: res.status,
		});
	return await res.json();
};

export const getProduct = async ({ id }, { signal }) => {
	const res = await fetch(`${url}/product/${id}`, { signal });
	if (!res.ok)
		throw new Error(`Error getting product ${id}`, {
			cause: res.status,
		});
	return await res.json();
};

export const getFeaturedProducts = async () => {
	const res = await fetch(`${url}/product/featured`);
	return await res.json();
};
