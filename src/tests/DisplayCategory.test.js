import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import DisplayCategory from "../components/DisplayCategory";
import Category from "../models/category";
import { BrowserRouter as Router } from "react-router-dom";
import { act } from "react-dom/test-utils";

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

	const name = screen.getByText(/category name/);
	expect(name).toBeInTheDocument();

	const description = screen.getByText(/description/);
	expect(description).toBeInTheDocument();
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
	act(() => {
		fireEvent.click(link);
	});
	expect(document.location.toString()).toContain("category-items/3");
});
