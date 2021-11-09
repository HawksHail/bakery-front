import React from "react";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "../components/LoginButton";
import userEvent from "@testing-library/user-event";

jest.mock("@auth0/auth0-react");

const user = {
	email: "johndoe@me.com",
	email_verified: true,
	sub: "google-oauth2|2147627834623744883746",
};

beforeEach(() => {
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user,
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

test("Login button renders", () => {
	render(<LoginButton />);

	expect(screen.getByText(/log in/i)).toBeInTheDocument();
});

test("Login button renders", () => {
	render(<LoginButton />);

	userEvent.click(screen.getByRole("button"));

	const { loginWithRedirect } = useAuth0();
	expect(loginWithRedirect).toBeCalled();
});
