import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import nock from "nock";

import AppContext from "../contexts";
import DisplayAllCategories from "../components/DisplayAllCategories";
import Category from "../models/category";
import { url } from "../api/url";

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
	render(
		<AppContext.Provider value={{ categories: [] }}>
			<Router>
				<DisplayAllCategories />
			</Router>
		</AppContext.Provider>
	);

	expect(screen.getByText(/Loading/)).toBeInTheDocument();
});

test("API is called and all products are rendered", async () => {
	const scope = nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/category")
		.reply(200, categories);

	const setCategories = jest.fn();
	render(
		<AppContext.Provider value={{ categories, setCategories }}>
			<Router>
				<DisplayAllCategories />
			</Router>
		</AppContext.Provider>
	);

	await waitFor(() => {
		expect(setCategories).toBeCalledTimes(1);
	});

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);
});
