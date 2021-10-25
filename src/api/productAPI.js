import { url } from "./url";

export const getAllProducts = async () => {
	const res = await fetch(`http://${url}/product`);
	return await res.json();
};
