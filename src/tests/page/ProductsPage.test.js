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

import AppContext from "../../contexts";
import ProductsPage from "../../page/ProductsPage";
import Supplier from "../../models/supplier";
import Category from "../../models/category";
import Product from "../../models/product";
import { url } from "../../api/url";
import ProductsContextProvider from "../../contexts/ProductsContextProvider";
import ToastContextProvider from "../../contexts/ToastContextProvider";

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
		<AppContext.Provider value={{ products: fakeProducts }}>
			<Router>
				<ProductsPage />
			</Router>
		</AppContext.Provider>
	);

	expect(
		screen.getByRole("heading", { name: /All products/i })
	).toBeInTheDocument();
});

test("all products are rendered", () => {
	render(
		<AppContext.Provider value={{ products: fakeProducts }}>
			<Router>
				<ProductsPage />
			</Router>
		</AppContext.Provider>
	);

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);
});

test("list not loaded yet", () => {
	render(
		<AppContext.Provider value={{ products: [] }}>
			<Router>
				<ProductsPage />
			</Router>
		</AppContext.Provider>
	);

	expect(screen.getByText(/Loading$/i)).toBeInTheDocument();
});

test("API is called and products are rendered", async () => {
	render(
		<ProductsContextProvider>
			<Router>
				<ProductsPage />
			</Router>
		</ProductsContextProvider>
	);

	await waitForElementToBeRemoved(() => screen.getByText(/Loading$/i));

	expect(fetchSpy).toBeCalledWith(`${url}/product`);

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);
});

test("Button POSTS to API", async () => {
	render(
		<ToastContextProvider>
			<AppContext.Provider
				value={{ products: fakeProducts, customer: { id: 9 } }}
			>
				<Router>
					<ProductsPage />
				</Router>
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
