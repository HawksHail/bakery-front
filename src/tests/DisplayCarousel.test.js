import { render, screen } from "@testing-library/react";

import DisplayCarousel from "../components/DisplayCarousel";

test("No array return null", async () => {
	const { container } = render(<DisplayCarousel />);

	expect(container.childElementCount).toEqual(0);
});

test("Empty array return null", async () => {
	const { container } = render(<DisplayCarousel arr={[]} />);

	expect(container.childElementCount).toEqual(0);
});

test("renders slides", () => {
	render(
		<DisplayCarousel
			arr={[
				{
					id: 1,
					imgURL: "https://picsum.photos/800/400?random=1",
					imgCredit: "credit link",
					productName: "First item title",
					category: { categoryName: "First item description" },
				},
				{
					id: 2,
					src: "https://picsum.photos/800/400?random=2",
					imgCredit: "credit link",
					productName: "Second item title",
					category: { categoryName: "Second item description" },
				},
			]}
		/>
	);

	expect(screen.getByText(/first item title/i)).toBeInTheDocument();

	expect(screen.getByText(/second item title/i)).toBeInTheDocument();
});
