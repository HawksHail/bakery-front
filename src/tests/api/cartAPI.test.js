import {
	getCart,
	addToCart,
	removeFromCart,
	checkoutCart,
} from "../../api/cartAPI";
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

test("getCart fetches properly", async () => {
	const abort = new AbortController();
	await getCart([1234, "token"], {}, { signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
		signal: abort,
	});
});

test("getCart fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getCart([1234, "token"], {}, { signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting cart");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
		signal: abort,
	});
});

test("addToCart fetches properly", () => {
	addToCart(1234, 567, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234/567?q=1`, {
		method: "POST",
		headers: {
			Authorization: `Bearer token`,
		},
	});

	addToCart(1234, 567, "token", 4);

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234/567?q=4`, {
		method: "POST",
		headers: {
			Authorization: `Bearer token`,
		},
	});
});

test("removeFromCart fetches properly", () => {
	removeFromCart(1234, 567, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234/567`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer token`,
		},
	});
});

test("checkoutCart fetches properly", () => {
	checkoutCart(1234, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234`, {
		method: "POST",
		headers: {
			Authorization: `Bearer token`,
		},
	});
});
