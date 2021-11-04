import { url } from "./url";

export const getCustomerIdFromSub = async (sub, accessToken) => {
	const res = await fetch(`${url}/customer/sub/${sub}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	if (res.status == 404) {
		throw new Error(404, { cause: res });
	}
	return await res.json();
};

export const createCustomer = async (sub, accessToken) => {
	const res = await fetch(`${url}/customer`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ sub: sub }),
	});
	return await res.json();
};
