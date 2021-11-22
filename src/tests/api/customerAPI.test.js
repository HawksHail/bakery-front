import {
	getCustomerIdFromSub,
	createCustomer,
	updateCustomer,
} from "../../api/customerAPI";
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

	expect(fetchSpy).toBeCalledWith(`${url}/customer/sub`, {
		method: "POST",
		headers: {
			Authorization: `Bearer token`,
			"Content-Type": "text/plain",
		},
		body: 1234,
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

test("updateCustomer fetches properly", () => {
	const fakeCustomer = {
		customerId: 1,
		sub: "auth0|id",
		companyName: "test Company",
		contactName: "test name",
		street: "test street",
		city: "test city",
		state: "test state",
	};

	updateCustomer(fakeCustomer, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/customer`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer token`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ customer: fakeCustomer }),
	});
});
