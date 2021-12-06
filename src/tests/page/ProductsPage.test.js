import React from "react";
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import AppContext, { ProductContext } from "../../contexts";
import AppContextProvider from "../../contexts/AppContextProvider";
import ToastContextProvider from "../../contexts/ToastContextProvider";
import ProductContextProvider from "../../contexts/ProductContextProvider";
import ProductsPage from "../../page/ProductsPage";
import Supplier from "../../models/supplier";
import Category from "../../models/category";
import Product from "../../models/product";
import { url } from "../../api/url";

jest.mock("@auth0/auth0-react");

const supplier = new Supplier(2, "company name", "contact name", []);
const category = new Category(3, "category name", "description", []);

const fakeProducts = [
	new Product(1, "name1", supplier, category, 3),
	new Product(4, "name2", supplier, category, 4),
];

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(fakeProducts),
		})
	);
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

test("Title is rendered", () => {
	render(
		<AppContextProvider>
			<ProductContext.Provider value={{ products: fakeProducts }}>
				<Router>
					<ProductsPage />
				</Router>
			</ProductContext.Provider>
		</AppContextProvider>
	);

	expect(
		screen.getByRole("heading", { name: /All products/i })
	).toBeInTheDocument();
});

test("all products are rendered", () => {
	render(
		<AppContextProvider>
			<ProductContext.Provider value={{ products: fakeProducts }}>
				<Router>
					<ProductsPage />
				</Router>
			</ProductContext.Provider>
		</AppContextProvider>
	);

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);
});

test("list not loaded yet displays loading", async () => {
	render(
		<AppContextProvider>
			<ProductContextProvider>
				<Router>
					<ProductsPage />
				</Router>
			</ProductContextProvider>
		</AppContextProvider>
	);

	expect(screen.getByText(/Loading$/i)).toBeInTheDocument();

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i), {
		//needed to prevent act error
		timeout: 3000,
	});
});

test("API is called and products are rendered", async () => {
	render(
		<AppContextProvider>
			<ProductContextProvider>
				<Router>
					<ProductsPage />
				</Router>
			</ProductContextProvider>
		</AppContextProvider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(fetchSpy).toBeCalledWith(`${url}/product`, { signal: undefined });

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);
});

test("API is called and returns error", async () => {
	const originalError = console.error;
	console.error = jest.fn();

	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			ok: false,
			json: () => Promise.resolve(fakeProducts),
		})
	);

	render(
		<AppContextProvider>
			<ProductContextProvider>
				<Router>
					<ProductsPage />
				</Router>
			</ProductContextProvider>
		</AppContextProvider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();

	expect(console.error).toBeCalledWith(new Error("Error getting products"));

	console.error = originalError;
});

test("Button POSTS to API", async () => {
	render(
		<ToastContextProvider>
			<AppContext.Provider value={{ customer: { id: 9 } }}>
				<ProductContext.Provider value={{ products: fakeProducts }}>
					<Router>
						<ProductsPage />
					</Router>
				</ProductContext.Provider>
			</AppContext.Provider>
		</ToastContextProvider>
	);

	const buttons = screen.getAllByRole("button", { name: /add to cart/i });
	expect(buttons.length).toBe(2);

	userEvent.click(buttons[0]);

	await waitFor(() => {
		expect(fetchSpy).toBeCalledWith(
			`${url}/cart/9/${fakeProducts[0].id}?q=1`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer token`,
				},
			}
		);
	});
});
