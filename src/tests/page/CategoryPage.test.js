import React from "react";
import {
	render,
	screen,
	waitFor,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { Route } from "react-router-dom";
import { MemoryRouter } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import AppContext from "../../contexts";
import Supplier from "../../models/supplier";
import Category from "../../models/category";
import Product from "../../models/product";
import CategoryPage from "../../page/CategoryPage";
import { url } from "../../api/url";
import ToastContextProvider from "../../contexts/ToastContextProvider";

jest.mock("@auth0/auth0-react");

const fakeCategory = new Category(1, "category name", "description", [
	new Product(
		5,
		"product5",
		new Supplier(10, "supplier10", "contact10", []),
		null,
		5
	),
	new Product(
		6,
		"product6",
		new Supplier(11, "supplier11", "contact11", []),
		null,
		4
	),
	new Product(
		7,
		"product7",
		new Supplier(12, "supplier12", "contact12", []),
		null,
		15
	),
]);

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

const user = {
	email: "johndoe@me.com",
	email_verified: true,
	sub: "google-oauth2|2147627834623744883746",
};

afterEach(function () {
	if (!nock.isDone()) {
		console.log(`nock.pendingMocks()`, nock.pendingMocks());
		nock.cleanAll();
		throw new Error("Not all nock interceptors were used!");
	}
});

beforeEach(() => {
	nock.cleanAll();
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user,
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

test("API call not loaded yet", () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/category/1")
		.optionally()
		.reply(200, fakeCategory);

	render(
		<MemoryRouter initialEntries={["/category-items/1"]}>
			<Route path="/category-items/:id">
				<CategoryPage />
			</Route>
		</MemoryRouter>
	);

	expect(screen.getByText(/Loading$/i)).toBeInTheDocument();
});

test("API is called and all products in category are rendered", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/category/1")
		.reply(200, fakeCategory);

	render(
		<MemoryRouter initialEntries={["/category-items/1"]}>
			<Route path="/category-items/:id">
				<CategoryPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(
		screen.getByRole("heading", { name: fakeCategory.categoryName })
	).toBeInTheDocument();

	expect(screen.getByRole("link", { name: "Category" })).toHaveAttribute(
		"href",
		"/category"
	);

	const cards = screen.getAllByText(/product[0-9]/);
	expect(cards).toHaveLength(3);
});

test("API returns error, and is displayed", async () => {
	const originalError = console.error;
	console.error = jest.fn();

	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/category/1")
		.reply(404);

	render(
		<MemoryRouter initialEntries={["/category-items/1"]}>
			<Route path="/category-items/:id">
				<CategoryPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();

	expect(console.error).toBeCalledWith(new Error("Error getting category 1"));

	console.error = originalError;
});

test("Button POSTS to API and sets cart", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/category/1")
		.reply(200, fakeCategory)
		.options(/\/cart\/9\/5/)
		.optionally()
		.reply(200, "cart")
		.post(/\/cart\/9\/5/)
		.reply(200, fakeCart);

	const setCart = jest.fn();

	render(
		<ToastContextProvider>
			<AppContext.Provider
				value={{
					customer: {
						id: 9,
						sub: "auth0|617c1ea289fdd10070ece377",
						companyName: "Test Company",
						contactName: "Test contact",
					},
					setCart,
				}}
			>
				<MemoryRouter initialEntries={["/category-items/1"]}>
					<Route path="/category-items/:id">
						<CategoryPage />
					</Route>
				</MemoryRouter>
			</AppContext.Provider>
		</ToastContextProvider>
	);

	await waitForElementToBeRemoved(screen.getByText("Loading"));

	const buttons = await screen.findAllByRole("button", {
		name: "Add to Cart",
	});
	expect(buttons).toHaveLength(3);

	userEvent.click(buttons[0]);

	await waitFor(() => {
		expect(setCart).toBeCalledTimes(1);
	});
});
