import { getCart, addToCart, removeFromCart } from "../../api/cartAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({}),
		})
	);
});

test("getCart fetches properly", () => {
	getCart(1234, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
	});
});

test("addToCart fetches properly", () => {
	addToCart(1234, 567, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/cart/1234/567`, {
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
