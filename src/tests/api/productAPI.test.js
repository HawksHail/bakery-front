import {
	getAllProducts,
	getFeaturedProducts,
	getProduct,
} from "../../api/productAPI";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({}),
		})
	);
});

test("getAllProducts fetches properly", () => {
	getAllProducts();

	expect(fetchSpy).toBeCalledWith(`${url}/product`);
});

test("getFeaturedProducts fetches properly", () => {
	getFeaturedProducts();

	expect(fetchSpy).toBeCalledWith(`${url}/product/featured`);
});

test("getProduct fetches properly", () => {
	getProduct(1);

	expect(fetchSpy).toBeCalledWith(`${url}/product/1`);
});
