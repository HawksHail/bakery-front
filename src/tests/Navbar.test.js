import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import Navbar from "../components/Navbar";
import AppContext from "../contexts";
import OrdersPage from "../page/OrdersPage";

jest.mock("@auth0/auth0-react");

const user = {
	email: "johndoe@me.com",
	name: "johndoe",
	email_verified: true,
	sub: "google-oauth2|12345678901234",
};

describe("Logged in tests", () => {
	beforeEach(() => {
		useAuth0.mockReturnValue({
			isAuthenticated: true,
			user,
			logout: jest.fn(),
			loginWithRedirect: jest.fn(),
			getAccessTokenSilently: jest.fn().mockReturnValue("token"),
		});
	});

	test("Navbar renders Home link with correct href value", () => {
		render(
			<AppContext.Provider value={{ setCustomer: jest.fn() }}>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		const homeLink = screen.getByText(/Home/);
		expect(homeLink).toBeInTheDocument();
		expect(homeLink.getAttribute("href")).toBe("/");
	});

	test("Navbar renders Category link with correct href value", () => {
		render(
			<AppContext.Provider value={{ setCustomer: jest.fn() }}>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		const homeLink = screen.getByText(/Category/);
		expect(homeLink).toBeInTheDocument();
		expect(homeLink.getAttribute("href")).toBe("/category");
	});

	test("Navbar renders Products link with correct href value", () => {
		render(
			<AppContext.Provider value={{ setCustomer: jest.fn() }}>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		const homeLink = screen.getByText(/Products/);
		expect(homeLink).toBeInTheDocument();
		expect(homeLink.getAttribute("href")).toBe("/product");
	});

	test("Navbar renders Cart link with correct href value", () => {
		render(
			<AppContext.Provider value={{ setCustomer: jest.fn() }}>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		const homeLink = screen.getByText(/Cart/);
		expect(homeLink).toBeInTheDocument();
		expect(homeLink.getAttribute("href")).toBe("/cart");
	});

	test("Navbar renders Orders link with correct href value", () => {
		render(
			<AppContext.Provider value={{ setCustomer: jest.fn() }}>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		const ordersLink = screen.getByText(/Orders/);
		expect(ordersLink).toBeInTheDocument();
		expect(ordersLink.getAttribute("href")).toBe("/orders");
	});

	test("Navbar renders profile link with contact name and correct href value", () => {
		render(
			<AppContext.Provider
				value={{
					setCustomer: jest.fn(),
					customer: { contactName: "name" },
				}}
			>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
			"href",
			"/profile"
		);

		expect(screen.getByText("name")).toBeInTheDocument();
	});

	test("Navbar renders profile link with Profile and correct href value", () => {
		render(
			<AppContext.Provider
				value={{
					setCustomer: jest.fn(),
					customer: { contactName: null },
				}}
			>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		expect(screen.getByRole("link", { name: "Profile" })).toHaveAttribute(
			"href",
			"/profile"
		);

		expect(screen.getByText("Profile")).toBeInTheDocument();
	});

	test("Log out button appears", () => {
		render(
			<AppContext.Provider value={{ setCustomer: jest.fn() }}>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		expect(screen.getByText(/log out/i)).toBeInTheDocument();

		expect(screen.getByAltText("johndoe")).toBeInTheDocument();
	});
});

describe("Logged out tests", () => {
	beforeEach(() => {
		useAuth0.mockReturnValue({
			isAuthenticated: false,
			user,
			logout: jest.fn(),
			loginWithRedirect: jest.fn(),
			getAccessTokenSilently: jest.fn().mockReturnValue("token"),
		});
	});

	test("Log in button appears", () => {
		render(
			<AppContext.Provider value={{ setCustomer: jest.fn() }}>
				<Router>
					<Navbar />
				</Router>
			</AppContext.Provider>
		);

		expect(screen.getByText(/log in/i)).toBeInTheDocument();

		expect(screen.queryByAltText("johndoe")).not.toBeInTheDocument();
	});
});
