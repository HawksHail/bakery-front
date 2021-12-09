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
import ProductPage from "../../page/ProductPage";
import { url } from "../../api/url";
import { ToastContext } from "../../contexts";
import ProductContextProvider from "../../contexts/ProductContextProvider";
import ToastContextProvider from "../../contexts/ToastContextProvider";
import DisplayToasts from "../../components/DisplayToasts";

jest.mock("@auth0/auth0-react");

const fakeProduct = new Product(
	5,
	"product5",
	new Supplier(10, "supplier10", "contact10", []),
	new Category(11, "category11", "description11", []),
	6
);

const fakeSuppliers = [
	new Supplier(1, "company1", "contact1"),
	new Supplier(2, "company2", "contact2"),
];

const fakeCategories = [
	new Category(1, "category1", "description1"),
	new Category(4, "category4", "description4"),
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

	expect(screen.getByRole("link", { name: "Category" })).toHaveAttribute(
		"href",
		"/category"
	);
	expect(
		screen.getByRole("link", { name: fakeProduct.category.categoryName })
	).toHaveAttribute("href", "/category/11");

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

test("API is called and returns error", async () => {
	const originalError = console.error;
	console.error = jest.fn();
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(404);

	render(
		<MemoryRouter initialEntries={["/product/1"]}>
			<Route path="/product/:id">
				<ProductPage />
			</Route>
		</MemoryRouter>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(screen.getByRole("heading", { name: "Error" })).toBeInTheDocument();

	expect(console.error).toBeCalledWith(new Error("Error getting product 1"));

	console.error = originalError;
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

test("Add to cart Button posts to API and alert appears", async () => {
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
	const handleAddToast = jest.fn();
	render(
		<ToastContext.Provider value={{ handleAddToast }}>
			<AppContext.Provider value={{ setCart, customer: { id: 99 } }}>
				<MemoryRouter initialEntries={["/product/1"]}>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
				</MemoryRouter>
			</AppContext.Provider>
		</ToastContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const cartButton = screen.getByRole("button", { name: /Add\sto\sCart/i });
	expect(cartButton).toBeInTheDocument();

	userEvent.click(cartButton);

	await waitFor(() => {
		expect(handleAddToast).toBeCalledTimes(1);
	});

	await waitFor(() => {
		expect(setCart).toBeCalledTimes(1);
	});
});

test("Admin mode quantity and add to cart buttons disapear", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ProductContextProvider>
				<MemoryRouter initialEntries={["/product/1"]}>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
				</MemoryRouter>
			</ProductContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(
		screen.queryByRole("button", { name: /Add\sto\sCart/i })
	).not.toBeInTheDocument();

	expect(screen.queryByRole("button", { name: "+" })).not.toBeInTheDocument();

	expect(screen.queryByRole("button", { name: "-" })).not.toBeInTheDocument();

	expect(
		screen.queryByRole("spinbutton", { name: /quantity/i })
	).not.toBeInTheDocument();
});

test("Admin mode editing forms appear", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ProductContextProvider>
				<MemoryRouter initialEntries={["/product/1"]}>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
				</MemoryRouter>
			</ProductContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();

	expect(
		screen.getByRole("textbox", { name: /Product Name/i })
	).toBeInTheDocument();

	expect(
		screen.getByRole("spinbutton", { name: /Price/i })
	).toBeInTheDocument();

	expect(
		screen.getByRole("combobox", { name: /Supplier/i })
	).toBeInTheDocument();

	expect(
		screen.getByRole("combobox", { name: /Category/i })
	).toBeInTheDocument();
});

test("Admin mode editing name enables save button", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ProductContextProvider>
				<MemoryRouter initialEntries={["/product/1"]}>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
				</MemoryRouter>
			</ProductContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const saveButton = screen.getByRole("button", { name: /Save/i });

	expect(saveButton).toBeInTheDocument();
	expect(saveButton).toBeDisabled();

	const nameBox = screen.getByRole("textbox", { name: /Product Name/i });

	expect(nameBox).toBeInTheDocument();

	userEvent.clear(nameBox);
	userEvent.type(nameBox, "qwerty");

	expect(nameBox).toHaveValue("qwerty");
	expect(saveButton).toBeEnabled();
});

test("Admin mode editing price enables save button", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ProductContextProvider>
				<MemoryRouter initialEntries={["/product/1"]}>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
				</MemoryRouter>
			</ProductContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const saveButton = screen.getByRole("button", { name: /Save/i });

	expect(saveButton).toBeInTheDocument();
	expect(saveButton).toBeDisabled();

	const priceBox = screen.getByRole("spinbutton", { name: /Price/i });

	expect(priceBox).toBeInTheDocument();

	userEvent.clear(priceBox);
	userEvent.type(priceBox, "64");

	expect(priceBox).toHaveValue(64);
	expect(saveButton).toBeEnabled();
});

test("Admin mode editing supplier enables save button", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ProductContextProvider>
				<MemoryRouter initialEntries={["/product/1"]}>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
				</MemoryRouter>
			</ProductContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const saveButton = screen.getByRole("button", { name: /Save/i });

	expect(saveButton).toBeInTheDocument();
	expect(saveButton).toBeDisabled();

	const supplierBox = screen.getByRole("combobox", { name: /Supplier/i });

	expect(supplierBox).toBeInTheDocument();

	expect(await screen.findByText("company2")).toBeInTheDocument();

	userEvent.selectOptions(supplierBox, "2");

	expect(saveButton).toBeEnabled();
	expect(screen.getByRole("option", { name: "company2" }).selected).toBe(
		true
	);
});

test("Admin mode editing category enables save button", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ProductContextProvider>
				<MemoryRouter initialEntries={["/product/1"]}>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
				</MemoryRouter>
			</ProductContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const saveButton = screen.getByRole("button", { name: /Save/i });

	expect(saveButton).toBeInTheDocument();
	expect(saveButton).toBeDisabled();

	const categoryBox = screen.getByRole("combobox", { name: /Category/i });

	expect(categoryBox).toBeInTheDocument();

	expect(await screen.findByText("category4")).toBeInTheDocument();

	userEvent.selectOptions(categoryBox, "4");

	expect(saveButton).toBeEnabled();
	expect(screen.getByRole("option", { name: "category4" }).selected).toBe(
		true
	);
});

test("Admin mode save button PUTs to API", async () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories)
		.options("/product")
		.optionally()
		.reply(200)
		.put("/product")
		.once()
		.reply(204);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ToastContextProvider>
				<ProductContextProvider>
					<MemoryRouter initialEntries={["/product/1"]}>
						<Route path="/product/:id">
							<ProductPage />
						</Route>
					</MemoryRouter>
				</ProductContextProvider>
			</ToastContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const saveButton = screen.getByRole("button", { name: /Save/i });

	expect(saveButton).toBeInTheDocument();
	expect(saveButton).toBeDisabled();

	const priceBox = screen.getByRole("spinbutton", { name: /Price/i });

	expect(priceBox).toBeInTheDocument();

	userEvent.clear(priceBox);
	userEvent.type(priceBox, "64");

	expect(priceBox).toHaveValue(64);
	expect(saveButton).toBeEnabled();

	userEvent.click(saveButton);

	await waitFor(() => expect(saveButton).toBeDisabled());
});

test("Admin mode suppliers fail to load creates notification", async () => {
	const originalError = console.error;
	console.error = jest.fn();

	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(500)
		.get("/category")
		.twice()
		.reply(200, fakeCategories);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ToastContextProvider>
				<ProductContextProvider>
					<MemoryRouter initialEntries={["/product/1"]}>
						<Route path="/product/:id">
							<ProductPage />
							<DisplayToasts />
						</Route>
					</MemoryRouter>
				</ProductContextProvider>
			</ToastContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const notification = await screen.findByRole("alert");
	expect(notification).toBeInTheDocument();
	expect(notification).toContainHTML("Failed to load suppliers");

	expect(console.error).toBeCalledWith(new Error("Error getting suppliers"));

	console.error = originalError;
});

test("Admin mode categories fail to load creates notification", async () => {
	const originalError = console.error;
	console.error = jest.fn();

	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(500);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ToastContextProvider>
				<ProductContextProvider>
					<MemoryRouter initialEntries={["/product/1"]}>
						<Route path="/product/:id">
							<ProductPage />
							<DisplayToasts />
						</Route>
					</MemoryRouter>
				</ProductContextProvider>
			</ToastContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const notification = await screen.findByRole("alert");
	expect(notification).toBeInTheDocument();
	expect(notification).toContainHTML("Failed to load categories");

	expect(console.error).toBeCalledWith(new Error("Error getting categories"));

	console.error = originalError;
});

test("Admin mode save button fails to save and creates notification", async () => {
	const originalError = console.error;
	console.error = jest.fn();

	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.get("/product/1")
		.reply(200, fakeProduct)
		.get("/supplier")
		.twice()
		.reply(200, fakeSuppliers)
		.get("/category")
		.twice()
		.reply(200, fakeCategories)
		.options("/product")
		.optionally()
		.reply(200)
		.put("/product")
		.once()
		.reply(500);

	render(
		<AppContext.Provider value={{ adminMode: true }}>
			<ToastContextProvider>
				<ProductContextProvider>
					<MemoryRouter initialEntries={["/product/1"]}>
						<Route path="/product/:id">
							<ProductPage />
							<DisplayToasts />
						</Route>
					</MemoryRouter>
				</ProductContextProvider>
			</ToastContextProvider>
		</AppContext.Provider>
	);

	await waitForElementToBeRemoved(screen.getByText(/Loading$/i));

	const saveButton = screen.getByRole("button", { name: /Save/i });

	expect(saveButton).toBeInTheDocument();
	expect(saveButton).toBeDisabled();

	const priceBox = screen.getByRole("spinbutton", { name: /Price/i });

	expect(priceBox).toBeInTheDocument();

	userEvent.clear(priceBox);
	userEvent.type(priceBox, "64");

	expect(priceBox).toHaveValue(64);
	expect(saveButton).toBeEnabled();

	userEvent.click(saveButton);

	const notification = await screen.findByRole("alert");
	expect(notification).toBeInTheDocument();
	expect(notification).toContainHTML("Failed to save product");

	expect(console.error).toBeCalledWith(new Error("Error updating product 5"));

	console.error = originalError;
});
