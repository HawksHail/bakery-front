import { getAllCategories, getCategory } from "../../api/categoryAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({}),
		})
	);
});

test("getAllCategories fetches properly", () => {
	getAllCategories();

	expect(fetchSpy).toBeCalledWith(`${url}/category`);
});

test("getCategory fetches properly", () => {
	getCategory(1234);

	expect(fetchSpy).toBeCalledWith(`${url}/category/1234`);
});
