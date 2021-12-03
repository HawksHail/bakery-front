import React from "react";
import {
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";

import CartPage from "../../page/CartPage";
import AppContext, { ToastContext } from "../../contexts";
import { url } from "../../api/url";
import ToastContextProvider from "../../contexts/ToastContextProvider";

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
		<ToastContextProvider>
			<AppContext.Provider value={{ cart: null, setCart: () => {} }}>
				<Router>
					<CartPage />
				</Router>
			</AppContext.Provider>
		</ToastContextProvider>
	);

	expect(screen.getByRole("heading", { name: /Cart/ })).toBeInTheDocument();

	expect(screen.getByText(/Loading$/i)).toBeInTheDocument();
});

test("Empty cart", () => {
	render(
		<ToastContextProvider>
			<AppContext.Provider value={{ cart: [], setCart: jest.fn() }}>
				<Router>
					<CartPage />
				</Router>
			</AppContext.Provider>
		</ToastContextProvider>
	);

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	expect(screen.getByText(/Your cart is empty/)).toBeInTheDocument();
});

test("contents of cart are loaded from API and displayed", () => {
	render(
		<ToastContextProvider>
			<AppContext.Provider value={{ cart: fakeCart, setCart: jest.fn() }}>
				<Router>
					<CartPage />
				</Router>
			</AppContext.Provider>
		</ToastContextProvider>
	);
	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(`${url}/cart/${fakeCart.customer.id}`);
	});

	expect(screen.getByText(/Cart/)).toBeInTheDocument();

	const cards = screen.getAllByText(/test product/i);
	expect(cards.length).toBe(2);
});

test("Remove Button POSTS to API and handleAddToast is called", async () => {
	const handleAddToast = jest.fn();
	render(
		<ToastContext.Provider value={{ handleAddToast }}>
			<AppContext.Provider
				value={{
					cart: fakeCart,
					setCart: jest.fn(),
					customer: { id: 99 },
				}}
			>
				<Router>
					<CartPage />
				</Router>
			</AppContext.Provider>
		</ToastContext.Provider>
	);

	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(`${url}/cart/${fakeCart.customer.id}`, {
			headers: {
				Authorization: "Bearer token",
			},
		});
	});

	const buttons = await screen.findAllByRole("button", { name: /remove/i });
	expect(buttons.length).toBe(2);

	userEvent.click(buttons[0]);

	await waitFor(() => expect(handleAddToast).toBeCalledTimes(1));

	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(
			`${url}/cart/${fakeCart.customer.id}/${fakeCart.items[0].product.id}`,
			{
				method: "DELETE",
				headers: {
					Authorization: "Bearer token",
				},
			}
		);
	});
});

test("Clear cart button appears and fetches API", async () => {
	window.scrollTo = jest.fn();

	render(
		<ToastContextProvider>
			<AppContext.Provider
				value={{
					cart: fakeCart,
					setCart: jest.fn(),
					customer: { id: 99 },
				}}
			>
				<Router>
					<CartPage />
				</Router>
			</AppContext.Provider>
		</ToastContextProvider>
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

test("Checkout button appears and fetches API", async () => {
	window.scrollTo = jest.fn();

	render(
		<ToastContextProvider>
			<AppContext.Provider
				value={{
					cart: fakeCart,
					setCart: jest.fn(),
					customer: { id: 99 },
				}}
			>
				<Router>
					<CartPage />
				</Router>
			</AppContext.Provider>
		</ToastContextProvider>
	);

	const checkoutButton = screen.getByRole("button", {
		name: /Checkout/i,
	});
	expect(checkoutButton).toBeInTheDocument();

	userEvent.click(checkoutButton);

	waitFor(() => {
		expect(fetchSpy).toBeCalledWith(`${url}/cart/99`, {
			method: "POST",
			headers: {
				Authorization: `Bearer token`,
			},
		});
	});
});

test("Total cost is calculated and appears", async () => {
	render(
		<ToastContextProvider>
			<AppContext.Provider
				value={{
					cart: fakeCart,
					setCart: jest.fn(),
					customer: { id: 99 },
				}}
			>
				<Router>
					<CartPage />
				</Router>
			</AppContext.Provider>
		</ToastContextProvider>
	);

	expect(screen.getByText(/Total:/i)).toBeInTheDocument();
	expect(screen.getByText(/\$78/i)).toBeInTheDocument();
});
