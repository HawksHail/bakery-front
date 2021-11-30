import React from "react";
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import nock from "nock";
import { Route } from "react-router-dom";
import { MemoryRouter } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import OrderDetailsPage from "../../page/OrderDetailsPage";
import { url } from "../../api/url";

jest.mock("@auth0/auth0-react");

const fakeOrder = {
	id: 1,
	customer: {
		customerId: 9,
	},
	orderDate: "2021-11-24",
	detailsList: [
		{
			id: {
				orderId: 1,
				productId: 31,
			},
			product: {
				id: 31,
				productName: "Product31",
				supplier: {
					id: 1,
					companyName: "Company1",
					contactName: "Contact1",
				},
				category: {
					id: 18,
					categoryName: "Category18",
					description: "Description18",
				},
				unitPrice: 8.5,
				imgURL: "https://picsum.photos/100/100",
			},
			quantity: 2,
		},
	],
};

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

test("Renders title", () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/1")
		.optionally()
		.reply(200)
		.get("/order/1")
		.optionally()
		.reply(200, fakeOrder);

	render(
		<MemoryRouter initialEntries={["/orders/1"]}>
			<Route path="/orders/:id">
				<OrderDetailsPage />
			</Route>
		</MemoryRouter>
	);

	expect(screen.getByText(/order\s*#1/i)).toBeInTheDocument();
});

test("Renders Loading", () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/1")
		.optionally()
		.reply(200)
		.get("/order/1")
		.optionally()
		.reply(200, fakeOrder);

	render(
		<MemoryRouter initialEntries={["/orders/1"]}>
			<Route path="/orders/:id">
				<OrderDetailsPage />
			</Route>
		</MemoryRouter>
	);

	expect(screen.getByText(/^loading$/i)).toBeInTheDocument();
});

test("Calls API and renders order details", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/1")
		.optionally()
		.reply(200)
		.get("/order/1")
		.optionally() //gets aborted and throws DOMException
		.reply(200, fakeOrder);

	render(
		<MemoryRouter initialEntries={["/orders/1"]}>
			<Route path="/orders/:id">
				<OrderDetailsPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/^loading$/i));

	expect(screen.getByText(/order #1/i)).toBeInTheDocument();
	expect(screen.getByText(/was placed on/)).toBeInTheDocument();
	expect(screen.getByText("2021-11-24")).toBeInTheDocument();
	expect(screen.getByText(/and is currently/)).toBeInTheDocument();
	expect(screen.getByText("Processing")).toBeInTheDocument();
});

test("Calls API and renders product table", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/1")
		.optionally()
		.reply(200)
		.get("/order/1")
		.optionally() //gets aborted and throws DOMException
		.reply(200, fakeOrder);

	render(
		<MemoryRouter initialEntries={["/orders/1"]}>
			<Route path="/orders/:id">
				<OrderDetailsPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/^loading$/i));

	const table = screen.getByRole("table");
	expect(table).toBeInTheDocument();

	expect(screen.getByText("Product")).toBeInTheDocument();
	expect(screen.getByText("Quantity")).toBeInTheDocument();
	expect(screen.getAllByText("Total")).toHaveLength(2);

	expect(table.rows).toHaveLength(3);

	expect(table.rows[1].textContent).toBe("Product312$17.00");
});
