import React from "react";
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import nock from "nock";

import { ProductContext } from "../../contexts";
import ProductContextProvider from "../../contexts/ProductContextProvider";
import CategoriesPage from "../../page/CategoriesPage";
import Category from "../../models/category";
import { url } from "../../api/url";

const categories = [
	new Category(1, "name1", "description1", [1]),
	new Category(4, "name2", "description2", [2]),
];

afterEach(function () {
	if (!nock.isDone()) {
		console.log(`nock.pendingMocks()`, nock.pendingMocks());
		nock.cleanAll();
		throw new Error("Not all nock interceptors were used!");
	}
});

test("list not loaded yet", () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/category")
		.optionally()
		.reply(200, categories);

	render(
		<ProductContext.Provider value={{ categories: [] }}>
			<Router>
				<CategoriesPage />
			</Router>
		</ProductContext.Provider>
	);

	expect(screen.getByText(/Loading$/i)).toBeInTheDocument();
});

test("API is called and all products are rendered", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/category")
		.reply(200, categories);

	render(
		<ProductContextProvider>
			<Router>
				<CategoriesPage />
			</Router>
		</ProductContextProvider>
	);

	await waitForElementToBeRemoved(() => screen.getByText(/Loading$/i));

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);
});

test("API is called returns error", async () => {
	const originalError = console.error;
	console.error = jest.fn();
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/category")
		.reply(404);

	render(
		<ProductContextProvider>
			<Router>
				<CategoriesPage />
			</Router>
		</ProductContextProvider>
	);

	await waitForElementToBeRemoved(() => screen.getByText(/Loading$/i));

	expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();

	expect(console.error).toBeCalledWith(new Error("Error getting categories"));

	console.error = originalError;
});
