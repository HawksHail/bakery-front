import { url } from "./url";

export const getAllProducts = async () => {
	const res = await fetch(`${url}/product`);
	return await res.json();
};

export const getFeaturedProducts = async () => {
	const res = await fetch(`${url}/product/featured`);
	return await res.json();
};
