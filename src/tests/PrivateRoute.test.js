import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";

import PrivateRoute from "../components/PrivateRoute";

jest.mock("@auth0/auth0-react");

test("Authenticated renders children", () => {
	useAuth0.mockReturnValue({
		isAuthenticated: true,
	});

	render(
		<Router>
			<PrivateRoute>
				<p>protected route</p>
			</PrivateRoute>
		</Router>
	);

	expect(screen.getByText("protected route")).toBeInTheDocument();
});

test("Unauthenticated redirects", () => {
	useAuth0.mockReturnValue({
		isAuthenticated: false,
	});

	render(
		<Router>
			<PrivateRoute path="/protected">
				<p>protected route</p>
			</PrivateRoute>
		</Router>
	);

	expect(screen.queryByText("protected route")).not.toBeInTheDocument();
});
