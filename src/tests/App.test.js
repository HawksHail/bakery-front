import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "../components/App";
import ProductsContextProvider from "../contexts/ProductsContextProvider";

test("Has Router with Route tags", () => {
	render(
		<ProductsContextProvider>
			<App />
		</ProductsContextProvider>
	);

	expect(screen.getByText(/learn react/i)).toBeInTheDocument();

	const category = screen.getByText(/category/i);
	userEvent.click(category);
	expect(document.location.toString()).toContain("/category");

	const products = screen.getByText(/products/i);
	userEvent.click(products);
	expect(document.location.toString()).toContain("/products");

	const cart = screen.getByText(/cart/i);
	userEvent.click(cart);
	expect(document.location.toString()).toContain("/cart");
});
