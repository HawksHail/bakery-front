import { getAllCategories, getCategory } from "../../api/categoryAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest
		.spyOn(global, "fetch")
		.mockImplementation(() =>
			Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
		);
});

test("getAllCategories fetches properly", async () => {
	const abort = new AbortController();
	await getAllCategories({ signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/category`, { signal: abort });
});

test("getAllCategories fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getAllCategories({ signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting categories");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/category`, { signal: abort });
});

test("getCategory fetches properly", async () => {
	const abort = new AbortController();
	await getCategory({ id: 1234 }, { signal: abort }).catch(e => {
		throw new Error("Failed", { cause: e });
	});

	expect(fetchSpy).toBeCalledWith(`${url}/category/1234`, { signal: abort });
});

test("getCategory fetches throws error", async () => {
	expect.assertions();
	fetchSpy.mockImplementation(() =>
		Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
	);
	const abort = new AbortController();

	try {
		await getCategory({ id: 1234 }, { signal: abort });
	} catch (error) {
		expect(error.message).toEqual("Error getting category 1234");
	}

	expect(fetchSpy).toBeCalledWith(`${url}/category/1234`, { signal: abort });
});
