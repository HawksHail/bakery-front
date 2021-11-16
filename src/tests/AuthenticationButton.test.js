import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";

import AuthenticationButton from "../components/AuthenticationButton";

jest.mock("@auth0/auth0-react");

test("Authenticated displays logout", () => {
	useAuth0.mockReturnValue({
		isAuthenticated: true,
	});

	render(<AuthenticationButton />);

	expect(screen.getByText("Log Out")).toBeInTheDocument();
});

test("Unauthenticated displays login", () => {
	useAuth0.mockReturnValue({
		isAuthenticated: false,
	});

	render(<AuthenticationButton />);

	expect(screen.getByText("Log In")).toBeInTheDocument();
});
