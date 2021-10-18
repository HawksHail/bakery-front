import React from "react";
import { render, screen } from "@testing-library/react";
import DisplayProduct from "../components/DisplayProduct";
import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";

let supplier = new Supplier(2, "company name", "contact name", []);
let category = new Category(3, "category name", "description", []);
let product = new Product(1, "product name", supplier, category, 5);
test("Card containing all info about product", () => {
	render(<DisplayProduct product={product} />);

	const name = screen.getByText(/product name/);
	expect(name).toBeInTheDocument();
	const supplier = screen.getByText(/Sold by:/);
	expect(supplier).toBeInTheDocument();
	const category = screen.getByText(/category/);
	expect(category).toBeInTheDocument();
	const price = screen.getByText(/5/);
	expect(price).toBeInTheDocument();
});
