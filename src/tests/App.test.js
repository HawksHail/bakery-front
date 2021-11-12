import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth0 } from "@auth0/auth0-react";

import App from "../components/App";
import ProductsContextProvider from "../contexts/ProductsContextProvider";
import { url } from "../api/url";

jest.mock("@auth0/auth0-react");
let fetchSpy;

const fakeUser = {
	customerId: 9,
	sub: "auth0|ID",
};

beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve(fakeUser),
		})
	);

	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user: { sub: "auth0|ID" },
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
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
	expect(document.location.toString()).toContain("/products");

	const cart = screen.getByText(/cart/i);
	userEvent.click(cart);
	expect(document.location.toString()).toContain("/cart");
});

test("fetches user using auth0 sub id", async () => {
	render(
		<ProductsContextProvider>
			<App />
		</ProductsContextProvider>
	);

	await waitFor(() => {
		expect(fetchSpy).toBeCalledWith(`${url}/customer/sub`, {
			method: "POST",
			headers: {
				Authorization: `Bearer token`,
				"Content-Type": "text/plain",
			},
			body: "auth0|ID",
		});
	});
});

test("fetches user using auth0 sub id returns 404 and tries to create new customer", async () => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.reject(new Error(404)),
		})
	);

	render(
		<ProductsContextProvider>
			<App />
		</ProductsContextProvider>
	);

	await waitFor(() => {
		expect(fetchSpy).toBeCalledWith(`${url}/customer/sub`, {
			method: "POST",
			headers: {
				Authorization: `Bearer token`,
				"Content-Type": "text/plain",
			},
			body: "auth0|ID",
		});
	});

	await waitFor(() => {
		expect(fetchSpy).toBeCalledWith(`${url}/customer`, {
			method: "POST",
			headers: {
				Authorization: `Bearer token`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sub: "auth0|ID" }),
		});
	});
});
