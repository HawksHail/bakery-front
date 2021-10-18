import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "../components/App";
import ProductsContextProvider from "../contexts/ProductsContextProvider";

test("Has Router with Route tags", () => {
	render(
		<ProductsContextProvider>
			<App />
		</ProductsContextProvider>
	);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();

	const category = screen.getByText(/category/i);
	fireEvent.click(category);
	expect(document.location.toString()).toContain("/category");

	const products = screen.getByText(/products/i);
	fireEvent.click(products);
	expect(document.location.toString()).toContain("/products");

	const cart = screen.getByText(/cart/i);
	fireEvent.click(cart);
	expect(document.location.toString()).toContain("/cart");
});
