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
					src: "https://picsum.photos/800/400?random=1",
					title: "First item title",
					description: "First item description",
				},
				{
					id: 2,
					src: "https://picsum.photos/800/400?random=2",
					title: "Second item title",
					description: "Second item description",
				},
			]}
		/>
	);

	expect(screen.getByText(/first item title/i)).toBeInTheDocument();

	expect(screen.getByText(/second item title/i)).toBeInTheDocument();
});
