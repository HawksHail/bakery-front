import { getOrders } from "../../api/orderApi";
import { url } from "../../api/url";

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({}),
		})
	);
});

test("getOrders fetches properly", () => {
	getOrders(1234, "token");

	expect(fetchSpy).toBeCalledWith(`${url}/order/customer/1234`, {
		headers: {
			Authorization: `Bearer token`,
		},
	});
});
