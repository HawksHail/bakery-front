import { url } from "./url";

export const getOrders = async (custId, accessToken) => {
	const res = await fetch(`${url}/order/customer/${custId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return await res.json();
};
