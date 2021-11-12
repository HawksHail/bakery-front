import React from "react";
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import userEvent from "@testing-library/user-event";

import DisplayCart from "../components/DisplayCart";
import AppContext from "../contexts";
import { url } from "../api/url";

jest.mock("@auth0/auth0-react");

const user = {
	email: "johndoe@me.com",
	email_verified: true,
	sub: "google-oauth2|2147627834623744883746",
};

const fakeCart = [
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
];

let fetchSpy;
beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve(fakeCart),
		})
	);

	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user,
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

test("Cart not loaded from API yet", () => {
	render(
		<AppContext.Provider value={{ cart: null, setCart: () => {} }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	expect(screen.getByText(/Loading/)).toBeInTheDocument();
});

test("Empty cart", () => {
	render(
		<AppContext.Provider value={{ cart: [], setCart: jest.fn() }}>
			<DisplayCart />
		</AppContext.Provider>
	);

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument();
});

test("contents of cart are loaded from API and displayed", () => {
	render(
		<AppContext.Provider value={{ cart: fakeCart, setCart: jest.fn() }}>
			<DisplayCart />
		</AppContext.Provider>
	);
	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(
			`${url}/cart/${fakeCart.customer.customerId}`
		);
	});

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	const cards = screen.getAllByText(/test product/i);
	expect(cards.length).toBe(2);
});

test("Button POSTS to API", async () => {
	render(
		<AppContext.Provider
			value={{
				cart: fakeCart,
				setCart: jest.fn(),
				customer: { customerId: 99 },
			}}
		>
			<DisplayCart />
		</AppContext.Provider>
	);

	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(
			`${url}/cart/${fakeCart.customer.customerId}`,
			{
				headers: {
					Authorization: "Bearer token",
				},
			}
		);
	});

	const buttons = await screen.findAllByRole("button", { name: /remove/i });
	expect(buttons.length).toBe(2);

	userEvent.click(buttons[0]);

	const alert = await screen.findByText(/Item removed!/i);
	expect(alert).toBeInTheDocument();

	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(
			`${url}/cart/${fakeCart.customer.customerId}/${fakeCart.items[0].product.id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: "Bearer token",
				},
			}
		);
	});

	userEvent.click(screen.getByRole("button", { name: /Close alert/i }));
	waitForElementToBeRemoved(alert);
});

test("Clear cart button appears and fetches API", async () => {
	render(
		<AppContext.Provider
			value={{
				cart: fakeCart,
				setCart: jest.fn(),
				customer: { customerId: 99 },
			}}
		>
			<DisplayCart />
		</AppContext.Provider>
	);

	const clearButton = screen.getByRole("button", {
		name: /clear cart/i,
	});
	expect(clearButton).toBeInTheDocument();

	const cards = screen.getAllByText(/test product/i);
	expect(cards.length).toBe(2);

	userEvent.click(clearButton);

	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(`${url}/cart/99`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer token`,
			},
		});
	});

	//need to mock fetch properly for this to work
	// await waitForElementToBeRemoved(cards[0]);
	// expect(cards[0]).not.toBeInTheDocument();
});

test("Total cost is calculated and appears", async () => {
	render(
		<AppContext.Provider
			value={{
				cart: fakeCart,
				setCart: jest.fn(),
				customer: { customerId: 99 },
			}}
		>
			<DisplayCart />
		</AppContext.Provider>
	);

	expect(screen.getByText(/Total:/i)).toBeInTheDocument();
	expect(screen.getByText(/\$78/i)).toBeInTheDocument();
});
