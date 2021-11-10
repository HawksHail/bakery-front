import { url } from "./url";

export const getCart = async (custId, accessToken) => {
	const res = await fetch(`${url}/cart/${custId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return await res.json();
};

export const addToCart = async (custId, prodId, accessToken) => {
	const res = await fetch(`${url}/cart/${custId}/${prodId}`, {
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
