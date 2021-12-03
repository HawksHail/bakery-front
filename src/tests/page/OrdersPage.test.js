import React from "react";
import {
	render,
	screen,
	waitForElementToBeRemoved,
} from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import nock from "nock";
import { BrowserRouter as Router } from "react-router-dom";

import OrdersPage from "../../page/OrdersPage";
import { url } from "../../api/url";
import AppContext from "../../contexts";

jest.mock("@auth0/auth0-react");

const fakeOrders = [
	{
		id: 282,
		customer: {
			id: 9,
		},
		orderDate: "2021-11-24",
		detailsList: [
			{
				id: {
					orderId: 282,
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
	},
	{
		id: 283,
		customer: {
			id: 9,
		},
		orderDate: "2021-11-23",
		detailsList: [
			{
				id: {
					orderId: 283,
					productId: 46,
				},
				product: {
					id: 46,
					productName: "Product46",
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
				quantity: 1,
			},
		],
	},
];

beforeEach(() => {
	if (!nock.isActive()) {
		nock.activate();
	}
	useAuth0.mockReturnValue({
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

afterEach(function () {
	if (!nock.isDone()) {
		console.log(`nock.pendingMocks()`, nock.pendingMocks());
		nock.cleanAll();
		throw new Error("Not all nock interceptors were used!");
	}
});

test("Renders Orders Title", () => {
	nock.restore();
	render(
		<Router>
			<OrdersPage />
		</Router>
	);

	expect(screen.getByText(/Orders$/i)).toBeInTheDocument();
});

test("Renders Table headers", async () => {
	 nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/customer/9")
		.optionally()
		.reply(200)
		.get("/order/customer/9")
		.optionally()
		.reply(200, fakeOrders);

	render(
		<AppContext.Provider value={{ customer: { id: 9 } }}>
			<Router>
				<OrdersPage />
			</Router>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getAllByText(/loading/i));

	expect(screen.getByText(/Order Number/i)).toBeInTheDocument();
	expect(screen.getByText(/Date/i)).toBeInTheDocument();
	expect(screen.getByText(/Status/i)).toBeInTheDocument();
	expect(screen.getByText(/Total/i)).toBeInTheDocument();
	expect(screen.getByText(/Link/i)).toBeInTheDocument();
});

test("Calls API and renders rows", async () => {
	 nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/customer/9")
		.optionally()
		.reply(200)
		.get("/order/customer/9")
		.reply(200, fakeOrders);

	render(
		<AppContext.Provider value={{ customer: { id: 9 } }}>
			<Router>
				<OrdersPage />
			</Router>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getAllByText(/loading/i));

	const table = screen.getByRole("table");

	expect(table.rows).toHaveLength(3);

	expect(table.rows[1].textContent).toBe("#2822021-11-24Pending$17.00View");
	expect(table.rows[2].textContent).toBe("#2832021-11-23Pending$8.50View");
});

test("Calls API and there are no orders", async () => {
	 nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/customer/9")
		.optionally()
		.reply(200)
		.get("/order/customer/9")
		.reply(200, []);

	render(
		<AppContext.Provider value={{ customer: { id: 9 } }}>
			<Router>
				<OrdersPage />
			</Router>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getAllByText(/loading/i));

	const table = screen.getByRole("table");

	expect(table.rows).toHaveLength(2);

	expect(table.rows[1].textContent).toBe("No orders");
});

test("Rows have links", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/order/customer/9")
		.optionally()
		.reply(200)
		.get("/order/customer/9")
		.reply(200, fakeOrders);

	render(
		<AppContext.Provider value={{ customer: { id: 9 } }}>
			<Router>
				<OrdersPage />
			</Router>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getAllByText(/loading/i));

	expect(
		screen.getByRole("link", { name: "#282" }).getAttribute("href")
	).toBe("/orders/282");
	expect(
		screen.getByRole("link", { name: "#283" }).getAttribute("href")
	).toBe("/orders/283");

	const views = screen.getAllByRole("link", { name: "View" });
	expect(views[0].getAttribute("href")).toBe("/orders/282");
	expect(views[1].getAttribute("href")).toBe("/orders/283");
});
