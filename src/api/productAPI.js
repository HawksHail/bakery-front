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

//args: [product, accessToken]
export const updateProduct = async (args, _, { signal }) => {
	const res = await fetch(`${url}/product`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${args[1]}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(args[0]),
		signal,
	});
	if (!res.ok)
		throw new Error(`Error updating product ${args[0].id}`, {
			cause: res.status,
		});
};
