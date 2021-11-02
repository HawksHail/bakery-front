import { url } from "./url";

export const getCustomerIdFromSub = async (sub, accessToken) => {
	const res = await fetch(`${url}/customer/sub/${sub}`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return await res.json();
};
