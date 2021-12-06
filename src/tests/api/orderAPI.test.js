import { getOrders, getOrder } from "../../api/orderAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({}),
		})
	);
});

test("getOrders fetches properly", async () => {
	const abort = new AbortController();
	await getOrders([1234, "token"], {}, { signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/order/customer/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
		signal: abort,
	});
});

test("getOrders fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getOrders([1234, "token"], {}, { signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting orders");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/order/customer/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
		signal: abort,
	});
});

test("getOrder fetches properly", async () => {
	const abort = new AbortController();
	await getOrder([1234, "token"], {}, { signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/order/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
		signal: abort,
	});
});

test("getOrder fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getOrder([1234, "token"], {}, { signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting order 1234");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/order/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
		signal: abort,
	});
});
