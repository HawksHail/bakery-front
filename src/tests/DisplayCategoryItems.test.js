import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Router, Route } from "react-router-dom";
import { MemoryRouter } from "react-router";
import { createMemoryHistory } from "history";

import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";
import DisplayCategoryItems from "../components/DisplayCategoryItems";

let fetchSpy;
let fakeCategory = new Category(1, "category name", "description", [
	new Product(
		5,
		"product5",
		new Supplier(10, "supplier10", "contact10", []),
		null,
		5
	),
	new Product(
		6,
		"product6",
		new Supplier(11, "supplier11", "contact11", []),
		null,
		4
	),
	new Product(
		7,
		"product7",
		new Supplier(12, "supplier12", "contact12", []),
		null,
		15
	),
]);

beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => JSON.stringify(fakeCategory),
		})
	);
});

test("API is called and all products in category are rendered", () => {
	act(() => {
		render(
			<MemoryRouter initialEntries={["/category-items/1"]}>
				<Route path="/category-items/:id">
					<DisplayCategoryItems />
				</Route>
			</MemoryRouter>
		);
	});

	//TODO check that all are rendered
	// const cards = screen.getAllByTestId("card");

	expect(fetchSpy).toBeCalledWith("http://localhost:8091/category/1");
	// expect(cards.length).toBe(2);
});

test("API call not loaded yet", () => {
	render(
		<MemoryRouter initialEntries={["/category-items/1"]}>
			<Route path="/category-items/:id">
				<DisplayCategoryItems />
			</Route>
		</MemoryRouter>
	);

	const load = screen.getByText(/Loading/);
	expect(load).toBeInTheDocument();
});
