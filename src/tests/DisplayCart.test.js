import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import DisplayCart from "../components/DisplayCart";
import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";
import AppContext from "../contexts";

const supplier = new Supplier(2, "company name", "contact name", []);
const category = new Category(3, "category name", "description", []);

const fakeCart = {
	cart: {
		items: [
			new Product(1, "name1", supplier, category, 3),
			new Product(4, "name2", supplier, category, 4),
		],
	},
};

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => JSON.stringify(fakeCart),
		})
	);
});

test("contents of cart are loaded and displayed", () => {
	render(
		<AppContext.Provider value={{ fakeCart, setCart: () => {} }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	const title = screen.getByText(/Cart/);
	expect(title).toBeInTheDocument();

	const empty = screen.getByText(/Your cart is empty/);
	expect(empty).toBeInTheDocument();
});

test("Empty cart", () => {
	render(
		<AppContext.Provider value={{ cart: { items: [] }, setCart: () => {} }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	const title = screen.getByText(/Cart/);
	expect(title).toBeInTheDocument();

	const empty = screen.getByText(/Your cart is empty/);
	expect(empty).toBeInTheDocument();
});

test("Cart not loaded from API yet", () => {
	render(
		<AppContext.Provider value={{ cart: {}, setCart: () => {} }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	const title = screen.getByText(/Cart/);
	expect(title).toBeInTheDocument();

	const empty = screen.getByText(/Loading/);
	expect(empty).toBeInTheDocument();
});
