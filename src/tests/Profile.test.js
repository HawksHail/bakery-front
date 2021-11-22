import { render, screen } from "@testing-library/react";
import Profile from "../components/Profile";

test("profile renders", () => {
	render(<Profile />);

	expect(screen.getByText("profile")).toBeInTheDocument();
});
