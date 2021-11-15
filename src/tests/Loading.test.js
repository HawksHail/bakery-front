import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import Loading from "../components/Loading";

test("Loading renders with spinner", () => {
	render(<Loading />);

	expect(screen.getByText(/loading$/i)).toBeInTheDocument();
	expect(screen.getByRole("status")).toBeInTheDocument();
});
