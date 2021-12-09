import { getAllSuppliers, getSupplier } from "../../api/supplierAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest
		.spyOn(global, "fetch")
		.mockImplementation(() =>
			Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
		);
});

test("getAllSuppliers fetches properly", async () => {
	const abort = new AbortController();
	await getAllSuppliers({ signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/supplier`, { signal: abort });
});

test("getAllSuppliers fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getAllSuppliers({ signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting suppliers");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/supplier`, { signal: abort });
});

test("getSupplier fetches properly", async () => {
	const abort = new AbortController();
	await getSupplier({ id: 1234 }, { signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/supplier/1234`, { signal: abort });
});

test("getSupplier fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getSupplier({ id: 1234 }, { signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting supplier 1234");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/supplier/1234`, { signal: abort });
});
