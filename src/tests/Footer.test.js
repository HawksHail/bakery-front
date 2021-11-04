import React from "react";
import { render, screen } from "@testing-library/react";

import Footer from "../components/Footer";

test("Footer renders", () => {
	render(<Footer />);

	expect(screen.getByText(/Blissful Bakery/i)).toBeInTheDocument();

	expect(screen.getAllByTestId("social").length).toBe(3);
});
