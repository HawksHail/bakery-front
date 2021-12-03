import {
	getCustomerIdFromSub,
	createCustomer,
	updateCustomer,
	getCustomer,
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

test("getCustomer fetches properly", () => {
	getCustomer(1234, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/customer/1234`, {
		method: "GET",
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

test("updateCustomer fetches properly", () => {
	const fakeCustomer = {
		id: 1,
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
		body: JSON.stringify(fakeCustomer),
	});
});
