import { url } from "./url";

//args: [orderId, accessToken]
export const getOrders = async (args, _, { signal }) => {
	const res = await fetch(`${url}/order/customer/${args[0]}`, {
		headers: {
			Authorization: `Bearer ${args[1]}`,
		},
		signal,
	});
	if (!res.ok)
		throw new Error(`Error getting orders`, {
			cause: res.status,
		});
	return await res.json();
};

//args: [orderId, accessToken]
export const getOrder = async (args, _, { signal }) => {
	const res = await fetch(`${url}/order/${args[0]}`, {
		headers: {
			Authorization: `Bearer ${args[1]}`,
		},
		signal,
	});
	if (!res.ok)
		throw new Error(`Error getting order ${args[0]}`, {
			cause: res.status,
		});
	return await res.json();
};
