import React from "react";
import { render, screen } from "@testing-library/react";

import OrdersPage from "../../page/OrdersPage";

test("Renders Orders Title", () => {
	render(<OrdersPage />);

	expect(screen.getByText(/Orders$/i)).toBeInTheDocument();
});
