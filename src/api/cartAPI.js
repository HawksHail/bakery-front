import { url } from "./url";

export const getCart = async id => {
	const res = await fetch(`${url}/cart/${id}`);
	return await res.json();
};
