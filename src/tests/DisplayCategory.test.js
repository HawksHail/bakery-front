import React from "react";
import { render, screen } from "@testing-library/react";
import DisplayCategory from "../components/DisplayCategory";
import Category from "../models/category";

test("Card containing all info about product", () => {
	render(
		<table>
			<tbody>
				<DisplayCategory
					category={
						new Category(3, "category name", "description", [])
					}
				/>
			</tbody>
		</table>
	);

	const name = screen.getByText(/category name/);
	expect(name).toBeInTheDocument();

	const description = screen.getByText(/description/);
	expect(description).toBeInTheDocument();
});
