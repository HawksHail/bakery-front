import React from "react";
import { render, screen } from "@testing-library/react";
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
			json: () => JSON.stringify(fakeProducts),
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

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);

	expect(fetchSpy).toBeCalledWith(`${url}/product`);
});

test("list not loaded yet", () => {
	render(
		<AppContext.Provider value={{ products: [] }}>
			<Router>
				<DisplayAllProducts />
			</Router>
		</AppContext.Provider>
	);

	const load = screen.getByText(/Loading/);
	expect(load).toBeInTheDocument();
});
