import { url } from "./url";

export const getCustomerIdFromSub = async sub => {
	const res = await fetch(`${url}/customer/sub`, sub);
	return await res.json();
};
