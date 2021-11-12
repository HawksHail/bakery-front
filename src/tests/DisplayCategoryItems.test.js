import React from "react";
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { Route } from "react-router-dom";
import { MemoryRouter } from "react-router";

import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";
import DisplayCategoryItems from "../components/DisplayCategoryItems";
import { url } from "../api/url";

const fakeCategory = new Category(1, "category name", "description", [
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

// let fetchSpy;
// beforeEach(() => {
// 	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
// 		Promise.resolve({
// 			json: () => Promise.resolve(fakeCategory),
// 		})
// 	);
// });

beforeEach(() => {
	nock(url)
		.defaultReplyHeaders({
			"access-control-allow-origin": "*",
			"access-control-allow-credentials": "true",
		})
		.get("/category/1")
		.reply(200, fakeCategory);
});

test("API is called and all products in category are rendered", async () => {
	render(
		<MemoryRouter initialEntries={["/category-items/1"]}>
			<Route path="/category-items/:id">
				<DisplayCategoryItems />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText("Loading"));

	const cards = await screen.findAllByText(/product[0-9]/);
	expect(cards).toHaveLength(3);
});

test("API call not loaded yet", () => {
	render(
		<MemoryRouter initialEntries={["/category-items/1"]}>
			<Route path="/category-items/:id">
				<DisplayCategoryItems />
			</Route>
		</MemoryRouter>
	);

	expect(screen.getByText(/Loading/)).toBeInTheDocument();
});

test("Button POSTS to API", async () => {
	render(
		<MemoryRouter initialEntries={["/category-items/1"]}>
			<Route path="/category-items/:id">
				<DisplayCategoryItems />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText("Loading"));

	const buttons = await screen.findAllByRole("button", {
		name: "Add to Cart",
	});
	expect(buttons).toHaveLength(3);

	//TODO fix using nock
	userEvent.click(buttons[0]);

	buttons = await screen.findAllByRole("button", {
		name: "Add to Cart",
	});
	expect(buttons).toHaveLength(2);
});
