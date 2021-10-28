import React from "react";
import { render, screen } from "@testing-library/react";

import DisplayCart from "../components/DisplayCart";
import AppContext from "../contexts";

const fakeCart = {
	customer: {
		customerId: "TEST1",
	},
	items: [
		{
			product: {
				id: 4,
				productName: "Test Product",
				supplier: {
					id: 1,
					companyName: "Test Company",
					contactName: "Test Contact",
				},
				category: {
					id: 2,
					categoryName: "Test Category",
					description: "Test description",
				},
				unitPrice: 22.0,
			},
			quantity: 2,
		},
		{
			product: {
				id: 5,
				productName: "Test Product2",
				supplier: {
					id: 1,
					companyName: "Test Company",
					contactName: "Test Contact",
				},
				category: {
					id: 13,
					categoryName: "Test Category2",
					description: "Second category",
				},
				unitPrice: 17.0,
			},
			quantity: 2,
		},
	],
};

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve(fakeCart),
		})
	);
});

test("contents of cart are loaded and displayed", () => {
	render(
		<AppContext.Provider value={{ cart: fakeCart, setCart: () => {} }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	const cards = screen.getAllByText(/test product/i);
	expect(cards.length).toBe(2);
});

test("Empty cart", () => {
	render(
		<AppContext.Provider value={{ cart: { items: [] }, setCart: () => {} }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument();
});

test("Cart not loaded from API yet", () => {
	render(
		<AppContext.Provider value={{ cart: {}, setCart: () => {} }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	expect(screen.getByText(/Loading/)).toBeInTheDocument();
});
