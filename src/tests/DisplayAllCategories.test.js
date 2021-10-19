import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import AppContext from "../contexts";
import DisplayAllCategories from "../components/DisplayAllCategories";
import Category from "../models/category";

const fakeCategories = {
	categories: [
		new Category(1, "name1", "description1", [1]),
		new Category(4, "name2", "description2", [2]),
	],
};

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => JSON.stringify(fakeCategories),
		})
	);
});

test("API is called and all products are rendered", () => {
	render(
		<AppContext.Provider value={fakeCategories}>
			<Router>
				<DisplayAllCategories />
			</Router>
		</AppContext.Provider>
	);

	const cards = screen.getAllByText(/name[0-9]/);
	expect(cards.length).toBe(2);

	expect(fetchSpy).toBeCalledWith("http://localhost:8091/category");
});

test("list not loaded yet", () => {
	render(
		<AppContext.Provider value={{ categories: [] }}>
			<Router>
				<DisplayAllCategories />
			</Router>
		</AppContext.Provider>
	);

	const load = screen.getByText(/Loading/);
	expect(load).toBeInTheDocument();
});
