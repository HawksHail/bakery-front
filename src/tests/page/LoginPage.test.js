import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import LoginPage from "../../page/LoginPage";

jest.mock("@auth0/auth0-react");

describe("Auth0 loaded", () => {
	describe("Auth0 not authenticated", () => {
		beforeEach(() => {
			useAuth0.mockReturnValue({
				isAuthenticated: false,
				isLoading: false,
			});
		});
		test("Login page renders", () => {
			render(
				<Router>
					<LoginPage />
					<Route path="/">home page</Route>
				</Router>
			);

			expect(
				screen.getByText(/You must log in to do that/i)
			).toBeInTheDocument();
		});
	});

	describe("Auth0 authenticated", () => {
		beforeEach(() => {
			useAuth0.mockReturnValue({
				isAuthenticated: true,
				isLoading: false,
			});
		});

		test("Login page redirects once logged in", () => {
			render(
				<Router>
					<LoginPage />
					<Route path="/">home page</Route>
				</Router>
			);

			expect(screen.getByText("home page")).toBeInTheDocument();
		});
	});
});

describe("Auth0 loading", () => {
	beforeEach(() => {
		useAuth0.mockReturnValue({
			isAuthenticated: false,
			isLoading: true,
		});
	});

	test("Loading spinner renders", () => {
		render(
			<Router>
				<LoginPage />
			</Router>
		);

		expect(screen.getByRole("status")).toBeInTheDocument();
	});
});
