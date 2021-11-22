import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";

let supplier = new Supplier(2, "test company", "contact name", []);
let category = new Category(3, "test category", "description", []);
let product = new Product(1, "test product", supplier, category, 5);

test("Card containing all info about product", () => {
	render(
		<Router>
			<ProductCard product={product} />
		</Router>
	);

	expect(screen.getByText(/.*test product.*/i)).toBeInTheDocument();

	expect(screen.getByText(/.*test category.*/i)).toBeInTheDocument();

	expect(screen.getByText(/.*test company.*/i)).toBeInTheDocument();

	expect(screen.getByText(/.*\$.*5.*/)).toBeInTheDocument();
});

test("Card has link to product", () => {
	render(
		<Router>
			<ProductCard product={product} />
		</Router>
	);

	expect(
		screen.getByRole("link", { name: /.*test product.*/i })
	).toHaveAttribute("href", "/product/1");
});

test("Button displayed and triggers action", () => {
	const funcMock = jest.fn();
	render(
		<Router>
			<ProductCard
				product={product}
				buttonText="Add to Cart"
				buttonClick={funcMock}
			/>
		</Router>
	);

	const button = screen.getByRole("button", { name: /add to cart/i });

	userEvent.click(button);

	expect(funcMock.mock.calls.length).toBe(1);
	expect(funcMock.mock.calls[0][0]).toBe(product.id);
});

test("quantity is displayed on button when provided", () => {
	render(
		<Router>
			<ProductCard
				product={product}
				buttonText="Remove"
				buttonClick={() => {}}
				quantity={99}
			/>
		</Router>
	);

	const button = screen.getByRole("button");
	expect(button).toBeInTheDocument();

	expect(screen.getByText(/99/)).toBeInTheDocument();
});
