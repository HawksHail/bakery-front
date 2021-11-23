import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Footer from "../components/Footer";

test("Footer renders", () => {
	render(
		<Router>
			<Footer />
		</Router>
	);

	expect(screen.getByText(/Blissful Bakery/i)).toBeInTheDocument();

	expect(screen.getAllByTestId("social").length).toBe(3);

	expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
});

test("Footer has lnks", () => {
	render(
		<Router>
			<Footer />
		</Router>
	);

	expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
		"href",
		"/"
	);

	expect(screen.getByRole("link", { name: "Twitter" })).toHaveAttribute(
		"href",
		"https://www.twitter.com"
	);

	expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
		"href",
		"https://www.instagram.com"
	);

	expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
		"href",
		"https://www.facebook.com"
	);
});
