import React from "react";
import { render, screen } from "@testing-library/react";
import Navbar from "../components/Navbar";
import { BrowserRouter as Router } from "react-router-dom";

test("Navbar renders Home link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);
	const homeLink = screen.getByText(/Home/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/");
});

test("Navbar renders Category link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);
	const homeLink = screen.getByText(/Category/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/category");
});

test("Navbar renders Products link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);
	const homeLink = screen.getByText(/Products/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/products");
});

test("Navbar renders Cart link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);
	const homeLink = screen.getByText(/Cart/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/cart");
});
