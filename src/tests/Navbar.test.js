import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import Navbar from "../components/Navbar";

//todo how to properly mock auth0 for logged in/logged out testing
const user = {
	email: "johndoe@me.com",
	name: "johndoe",
	email_verified: true,
	sub: "google-oauth2|12345678901234",
};

jest.mock("@auth0/auth0-react", () => ({
	Auth0Provider: ({ children }) => children,
	withAuthenticationRequired: (component, _) => component,
	useAuth0: () => {
		return {
			isLoading: false,
			user,
			isAuthenticated: true,
			logout: jest.fn(),
			loginWithRedirect: jest.fn(),
			getAccessTokenWithPopup: jest.fn(),
			getAccessTokenSilently: jest.fn(),
			getIdTokenClaims: jest.fn(),
			loginWithPopup: jest.fn(),
		};
	},
}));

test("Navbar renders Home link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);

	const homeLink = screen.getByText(/Home/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/");
});

test("Navbar renders Category link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);

	const homeLink = screen.getByText(/Category/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/category");
});

test("Navbar renders Products link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);

	const homeLink = screen.getByText(/Products/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/products");
});

test("Navbar renders Cart link with correct href value", () => {
	render(
		<Router>
			<Navbar />
		</Router>
	);

	const homeLink = screen.getByText(/Cart/);
	expect(homeLink).toBeInTheDocument();
	expect(homeLink.getAttribute("href")).toBe("/cart");
});

describe("Logged in tests", () => {
	beforeEach(() => {});

	test("Log out button appears", () => {
		render(
			<Router>
				<Navbar />
			</Router>
		);

		expect(screen.getByText(/log out/i)).toBeInTheDocument();

		expect(screen.getByAltText("johndoe")).toBeInTheDocument();
	});
});
