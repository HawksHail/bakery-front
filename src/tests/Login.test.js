import React from "react";
import { render, screen } from "@testing-library/react";

import Login from "../components/Login";

test("Login page renders", () => {
	render(<Login />);

	expect(screen.getByText(/You must log in to do that/i)).toBeInTheDocument();
});
