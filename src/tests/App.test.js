import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth0 } from "@auth0/auth0-react";

import App from "../components/App";
import ProductsContextProvider from "../contexts/ProductsContextProvider";

jest.mock("@auth0/auth0-react");

beforeEach(() => {
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user: {},
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

test("Has Router with Route tags", () => {
	render(
		<ProductsContextProvider>
			<App />
		</ProductsContextProvider>
	);

	expect(screen.getByText(/Welcome/i)).toBeInTheDocument();

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
