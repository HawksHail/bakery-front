import { url } from "./url";

export const getCustomer = async (id, accessToken) => {
	const res = await fetch(`${url}/customer/${id}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return await res.json();
};

export const getCustomerIdFromSub = async (sub, accessToken) => {
	const res = await fetch(`${url}/customer/sub`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "text/plain",
		},
		body: sub,
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

export const updateCustomer = async (customer, accessToken) => {
	await fetch(`${url}/customer`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(customer),
	});
};
