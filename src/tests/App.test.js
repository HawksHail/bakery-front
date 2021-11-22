import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth0 } from "@auth0/auth0-react";
import nock from "nock";

import App from "../components/App";
import ProductsContextProvider from "../contexts/ProductsContextProvider";
import AppContext from "../contexts";
import { url } from "../api/url";

jest.mock("@auth0/auth0-react");

const fakeUser = {
	customerId: 9,
	sub: "auth0|ID",
};

beforeEach(() => {
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user: { sub: "auth0|ID" },
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

afterEach(function () {
	if (!nock.isDone()) {
		console.log(`nock.pendingMocks()`, nock.pendingMocks());
		nock.cleanAll();
		throw new Error("Not all nock interceptors were used!");
	}
});

test("Has Router with Route tags", () => {
	render(
		<ProductsContextProvider>
			<App />
		</ProductsContextProvider>
	);

	expect(screen.getByText(/Welcome/i)).toBeInTheDocument();

	const category = screen.getByText(/category/i);
	userEvent.click(category);
	expect(document.location.toString()).toContain("/category");

	const products = screen.getByText(/products/i);
	userEvent.click(products);
	expect(document.location.toString()).toContain("/product");

	const cart = screen.getByText(/cart/i);
	userEvent.click(cart);
	expect(document.location.toString()).toContain("/cart");
});

test("fetches user using auth0 sub id", async () => {
	const scope = nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/customer/sub")
		.optionally()
		.reply(200)
		.post("/customer/sub")
		.reply(200, fakeUser);

	const setCustomer = jest.fn();
	render(
		<AppContext.Provider value={{ setCustomer }}>
			<App />
		</AppContext.Provider>
	);

	await waitFor(() => {
		expect(setCustomer).toBeCalledTimes(1);
	});
});

test("fetches user using auth0 sub id returns 404 and tries to create new customer", async () => {
	const scope = nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/customer/sub")
		.optionally()
		.reply(200)
		.post("/customer/sub")
		.reply(404)
		.options("/customer")
		.optionally()
		.reply(200)
		.post("/customer")
		.reply(200, fakeUser);

	const setCustomer = jest.fn();
	render(
		<AppContext.Provider value={{ setCustomer }}>
			<App />
		</AppContext.Provider>
	);

	await waitFor(() => {
		expect(setCustomer).toBeCalledTimes(1);
	});
});
