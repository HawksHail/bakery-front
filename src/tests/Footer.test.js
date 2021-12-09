import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import userEvent from "@testing-library/user-event";

import Footer from "../components/Footer";
import AppContext from "../contexts";

jest.mock("@auth0/auth0-react");
const getIdTokenClaims = jest
	.fn()
	.mockReturnValue({ "https://zion.ee-cognizantacademy.com/roles": [] });

beforeEach(() => {
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		getIdTokenClaims,
	});
});

test("Footer renders", async () => {
	render(
		<Router>
			<Footer />
		</Router>
	);

	expect(screen.getByText(/Blissful Bakery/i)).toBeInTheDocument();

	expect(screen.getAllByTestId("social").length).toBe(3);

	expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();

	await waitFor(() => expect(getIdTokenClaims).toBeCalled());
});

test("Footer has links", async () => {
	render(
		<Router>
			<Footer />
		</Router>
	);

	expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
		"href",
		"/"
	);

	expect(screen.getByRole("link", { name: "Twitter" })).toHaveAttribute(
		"href",
		"https://www.twitter.com"
	);

	expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute(
		"href",
		"https://www.instagram.com"
	);

	expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute(
		"href",
		"https://www.facebook.com"
	);
	await waitFor(() => expect(getIdTokenClaims).toBeCalled());
});

test("Footer renders admin toggle", async () => {
	const getIdTokenClaims = jest.fn().mockReturnValue({
		"https://zion.ee-cognizantacademy.com/roles": ["admin"],
	});

	useAuth0.mockReturnValue({
		isAuthenticated: true,
		getIdTokenClaims,
	});

	render(
		<Router>
			<Footer />
		</Router>
	);

	await waitFor(() => expect(getIdTokenClaims).toBeCalled());

	expect(screen.getByRole("checkbox")).toBeInTheDocument();
});

test("Admin toggle changes state", async () => {
	const getIdTokenClaims = jest.fn().mockReturnValue({
		"https://zion.ee-cognizantacademy.com/roles": ["admin"],
	});

	useAuth0.mockReturnValue({
		isAuthenticated: true,
		getIdTokenClaims,
	});

	const setAdminMode = jest.fn();

	render(
		<AppContext.Provider value={{ setAdminMode }}>
			<Router>
				<Footer />
			</Router>
		</AppContext.Provider>
	);

	await waitFor(() => expect(getIdTokenClaims).toBeCalled());

	const toggle = screen.getByRole("checkbox");

	expect(toggle).toBeInTheDocument();

	userEvent.click(toggle);

	expect(setAdminMode).toBeCalledTimes(1);
});
