import { getAllProducts } from "../../api/productAPI";
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
