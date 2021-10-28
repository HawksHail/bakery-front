import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
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

test("Button displayed and triggers action", () => {
	const funcMock = jest.fn();
	const { getByTestId } = render(
		<DisplayProduct
			product={product}
			buttonText="Add to Cart"
			buttonClick={funcMock}
		/>
	);

	const button = getByTestId("productCardButton");
	expect(button.innerHTML).toBe("Add to Cart");

	act(() => {
		fireEvent.click(button);
	});

	expect(funcMock.mock.calls.length).toBe(1);
	expect(funcMock.mock.calls[0][0]).toBe(product.id);
});
