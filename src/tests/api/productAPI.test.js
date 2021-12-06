import {
	getAllProducts,
	getFeaturedProducts,
	getProduct,
} from "../../api/productAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest
		.spyOn(global, "fetch")
		.mockImplementation(() =>
			Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
		);
});

test("getAllProducts fetches properly", async () => {
	const abort = new AbortController();
	await getAllProducts({ signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/product`, { signal: abort });
});

test("getAllProducts fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getAllProducts({ signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting products");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/product`, { signal: abort });
});

test("getFeaturedProducts fetches properly", () => {
	getFeaturedProducts();

	expect(fetchSpy).toBeCalledWith(`${url}/product/featured`);
});

test("getProduct fetches properly", async () => {
	const abort = new AbortController();
	await getProduct({ id: 1234 }, { signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/product/1234`, { signal: abort });
});

test("getProduct fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getProduct({ id: 1234 }, { signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting product 1234");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/product/1234`, { signal: abort });
});
