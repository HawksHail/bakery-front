import { url } from "./url";

//args: [customerId, accessToken]
export const getCart = async (args, _, { signal }) => {
	const res = await fetch(`${url}/cart/${args[0]}`, {
		headers: {
			Authorization: `Bearer ${args[1]}`,
		},
		signal,
	});
	if (!res.ok)
		throw new Error(`Error getting cart`, {
			cause: res.status,
		});
	return await res.json();
};

export const addToCart = async (custId, prodId, accessToken, quantity = 1) => {
	const res = await fetch(`${url}/cart/${custId}/${prodId}?q=${quantity}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return await res.json();
};

export const removeFromCart = async (custId, prodId, accessToken) => {
	const res = await fetch(`${url}/cart/${custId}/${prodId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return await res.json();
};

export const clearCart = async (custId, accessToken) => {
	await fetch(`${url}/cart/${custId}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
};

export const checkoutCart = async (custId, accessToken) => {
	const res = await fetch(`${url}/cart/${custId}`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return res.json();
};
