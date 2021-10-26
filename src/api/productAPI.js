import { url } from "./url";

export const getAllProducts = async () => {
	const res = await fetch(`${url}/product`);
	return await res.json();
};
