import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";

import DisplayCategory from "../components/DisplayCategory";
import Category from "../models/category";

test("Card containing all info about product", () => {
	render(
		<Router>
			<table>
				<tbody>
					<DisplayCategory
						category={
							new Category(3, "category name", "description", [])
						}
					/>
				</tbody>
			</table>
		</Router>
	);

	expect(screen.getByText(/category name/)).toBeInTheDocument();

	expect(screen.getByText(/description/)).toBeInTheDocument();
});

test("Click link to category items", () => {
	const { getByTestId } = render(
		<Router>
			<table>
				<tbody>
					<DisplayCategory
						category={
							new Category(3, "category name", "description", [])
						}
					/>
				</tbody>
			</table>
		</Router>
	);

	const link = getByTestId("link");
	userEvent.click(link);

	expect(document.location.toString()).toContain("category-items/3");
});
