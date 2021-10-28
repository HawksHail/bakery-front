import { url } from "./url";

export const getCart = async custId => {
	const res = await fetch(`${url}/cart/${custId}`);
	return await res.json();
};

export const addToCart = async (custId, prodId) => {
	const res = await fetch(`${url}/cart/${custId}/${prodId}`, {
		method: "POST",
	});
	return await res.json();
};

export const removeFromCart = async (custId, prodId) => {
	const res = await fetch(`${url}/cart/${custId}/${prodId}`, {
		method: "DELETE",
	});
	return await res.json();
};
