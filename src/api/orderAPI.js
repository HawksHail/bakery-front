import { url } from "./url";

export const getOrders = async (custId, accessToken, abortController) => {
	const res = await fetch(`${url}/order/customer/${custId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		signal: abortController?.signal,
	});
	return await res.json();
};

export const getOrder = async (orderId, accessToken, abortController) => {
	const res = await fetch(`${url}/order/${orderId}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		signal: abortController?.signal,
	});
	return await res.json();
};
