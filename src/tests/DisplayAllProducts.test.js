import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";

import AppContext from "../contexts";
import DisplayAllProducts from "../components/DisplayAllProducts";
import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";
import { url } from "../api/url";

const supplier = new Supplier(2, "company name", "contact name", []);
const category = new Category(3, "category name", "description", []);

const fakeProducts = {
	products: [
		new Product(1, "name1", supplier, category, 3),
		new Product(4, "name2", supplier, category, 4),
	],
};

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve(fakeProducts),
		})
	);
});

test("all products are rendered", () => {
	render(
		<AppContext.Provider value={fakeProducts}>
			<Router>
				<DisplayAllProducts />
			</Router>
		</AppContext.Provider>
	);

	expect(fetchSpy).toBeCalledWith(`${url}/product`);

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);
});

test("list not loaded yet", () => {
	render(
		<AppContext.Provider value={{ products: [] }}>
			<Router>
				<DisplayAllProducts />
			</Router>
		</AppContext.Provider>
	);

	expect(screen.getByText(/Loading$/i)).toBeInTheDocument();
});

test("Button POSTS to API", () => {
	render(
		<AppContext.Provider value={fakeProducts}>
			<Router>
				<DisplayAllProducts />
			</Router>
		</AppContext.Provider>
	);

	expect(fetchSpy).toBeCalledWith(`${url}/product`);

	const buttons = screen.getAllByRole("button", { name: /add to cart/i });
	expect(buttons.length).toBe(2);

	userEvent.click(buttons[0]);
	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(
			`${url}/cart/test1/${fakeProducts.products[0].id}`,
			{ method: "POST" }
		);
	});
});
