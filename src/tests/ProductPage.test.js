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

import AppContext from "../contexts";
import Supplier from "../models/supplier";
import Category from "../models/category";
import Product from "../models/product";
import ProductPage from "../components/ProductPage";
import { url } from "../api/url";

jest.mock("@auth0/auth0-react");

const fakeProduct = new Product(
	5,
	"product5",
	new Supplier(10, "supplier10", "contact10", []),
	new Category(11, "category11", "description11", []),
	6
);

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
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user,
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

test("Displays loading", () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.optionally()
		.reply(200, fakeProduct);

	render(
		<MemoryRouter initialEntries={["/product/1"]}>
			<Route path="/product/:id">
				<ProductPage />
			</Route>
		</MemoryRouter>
	);

	expect(screen.getByText(/Loading$/i)).toBeInTheDocument();
});

test("API is called and product is rendered", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct);

	render(
		<MemoryRouter initialEntries={["/product/1"]}>
			<Route path="/product/:id">
				<ProductPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(screen.getByRole("link", { name: "Category" })).toBeInTheDocument();
	expect(
		screen.getByRole("link", { name: fakeProduct.category.categoryName })
	).toBeInTheDocument();

	expect(
		screen.getByRole("img", { name: /product[0-9]+/ })
	).toBeInTheDocument();
	expect(
		screen.getByRole("heading", { name: /product[0-9]+/ })
	).toBeInTheDocument();
	expect(screen.getByText(/category[0-9]+/)).toBeInTheDocument();
	expect(screen.getByText(/supplier[0-9]+/)).toBeInTheDocument();
	expect(screen.getByText(/\$[0-9]+/)).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: /Add\sto\scart/ })
	).toBeInTheDocument();
});

test("Quantity +/- button increments/decrements quantity", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct);

	render(
		<MemoryRouter initialEntries={["/product/1"]}>
			<Route path="/product/:id">
				<ProductPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const quantity = screen.getByRole("spinbutton", { name: "quantity" });
	expect(quantity).toHaveValue(1);

	const plus = screen.getByRole("button", { name: "+" });
	expect(plus).toBeInTheDocument();

	const minus = screen.getByRole("button", { name: "-" });
	expect(minus).toBeInTheDocument();

	userEvent.click(plus);
	expect(quantity).toHaveValue(2);

	userEvent.click(minus);
	expect(quantity).toHaveValue(1);

	userEvent.click(minus);
	expect(quantity).toHaveValue(1);
});

test("Typing quantity box updates quantity", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct);

	render(
		<MemoryRouter initialEntries={["/product/1"]}>
			<Route path="/product/:id">
				<ProductPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const quantity = screen.getByRole("spinbutton", { name: "quantity" });
	expect(quantity).toHaveValue(1);

	userEvent.clear(quantity);
	userEvent.type(quantity, "5");
	expect(quantity).toHaveValue(5);
});

test("Add to cart Button posts to API", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.options(/cart\/[0-9]+\/[0-9]+/)
		.optionally()
		.reply(200)
		.post(/cart\/[0-9]+\/[0-9]+/)
		.query({ q: /[0-9]+/ })
		.once()
		.reply(200, [{ product: fakeProduct, quantity: 1 }]);

	const setCart = jest.fn();

	render(
		<AppContext.Provider value={{ setCart, customer: { customerId: 99 } }}>
			<MemoryRouter initialEntries={["/product/1"]}>
				<Route path="/product/:id">
					<ProductPage />
				</Route>
			</MemoryRouter>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const cartButton = screen.getByRole("button", { name: /Add\sto\sCart/i });
	expect(cartButton).toBeInTheDocument();

	userEvent.click(cartButton);

	await waitFor(() => {
		expect(setCart).toBeCalledTimes(1);
	});
});
