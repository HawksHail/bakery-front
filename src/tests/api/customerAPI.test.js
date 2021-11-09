import { getCustomerIdFromSub, createCustomer } from "../../api/customerAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({}),
		})
	);
});

test("getCustomerIdFromSub fetches properly", () => {
	getCustomerIdFromSub(1234, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/customer/sub/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
	});
});

test("createCustomer fetches properly", () => {
	createCustomer(1234, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/customer`, {
		method: "POST",
		headers: {
			Authorization: `Bearer token`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ sub: 1234 }),
	});
});
