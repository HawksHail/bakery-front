import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import DisplayCarousel from "../components/DisplayCarousel";

test("No array return null", async () => {
	const { container } = render(<DisplayCarousel />);

	expect(container.childElementCount).toEqual(0);
});

test("Empty array return null", async () => {
	const { container } = render(<DisplayCarousel arr={[]} />);

	expect(container.childElementCount).toEqual(0);
});

test("renders slides", () => {
	render(
		<Router>
			<DisplayCarousel
				arr={[
					{
						id: 1,
						imgURL: "https://picsum.photos/800/400?random=1",
						imgCredit: "credit link",
						productName: "First item title",
						category: { categoryName: "First item description" },
					},
					{
						id: 2,
						src: "https://picsum.photos/800/400?random=2",
						imgCredit: "credit link",
						productName: "Second item title",
						category: { categoryName: "Second item description" },
					},
				]}
			/>
		</Router>
	);

	expect(screen.getByText(/first item title/i)).toBeInTheDocument();

	expect(screen.getByText(/second item title/i)).toBeInTheDocument();
});

test("Carousel has links", () => {
	render(
		<Router>
			<DisplayCarousel
				arr={[
					{
						id: 1,
						imgURL: "https://picsum.photos/800/400?random=1",
						imgCredit: "credit link",
						productName: "First item title",
						category: {
							id: 1,
							categoryName: "First item description",
						},
					},
					{
						id: 2,
						src: "https://picsum.photos/800/400?random=2",
						imgCredit: "credit link",
						productName: "Second item title",
						category: {
							id: 2,
							categoryName: "Second item description",
						},
					},
				]}
			/>
		</Router>
	);

	expect(
		screen.getByRole("link", { name: "First item title" })
	).toHaveAttribute("href", "/product/1");

	expect(
		screen.getByRole("link", { name: "First item description" })
	).toHaveAttribute("href", "/category/1");

	expect(
		screen.getByRole("link", { name: "Second item title" })
	).toHaveAttribute("href", "/product/2");

	expect(
		screen.getByRole("link", { name: "Second item description" })
	).toHaveAttribute("href", "/category/2");
});
