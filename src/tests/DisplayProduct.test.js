import React from "react";
import { render, screen } from "@testing-library/react";
import DisplayProduct from "../components/DisplayProduct";
import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";

let supplier = new Supplier(2, "test company", "contact name", []);
let category = new Category(3, "test category", "description", []);
let product = new Product(1, "test product", supplier, category, 5);
test("Card containing all info about product", () => {
	const { getByTestId } = render(<DisplayProduct product={product} />);

	const name = getByTestId("productName");
	expect(name).toBeInTheDocument();
	expect(name.innerHTML).toBe("test product");

	const category = getByTestId("categoryName");
	expect(category).toBeInTheDocument();
	expect(category.innerHTML).toBe("test category");

	const company = getByTestId("companyName");
	expect(company).toBeInTheDocument();
	expect(company.innerHTML).toBe("Sold by: test company");

	const price = getByTestId("unitPrice");
	expect(price).toBeInTheDocument();
	expect(price.innerHTML).toBe("$5");
});
