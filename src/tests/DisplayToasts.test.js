import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import DisplayToasts from "../components/DisplayToasts";
import ToastContextProvider from "../contexts/ToastContextProvider";
import useToasts from "../hooks/useToasts";

jest.mock("../hooks/useToasts");

test("Renders nothing when no notifications", () => {
	useToasts.mockReturnValue({
		toasts: [],
		setToasts: jest.fn(),
		handleAddToast: jest.fn(),
	});
	render(
		<ToastContextProvider>
			<DisplayToasts />
		</ToastContextProvider>
	);

	expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("Renders toast", () => {
	useToasts.mockReturnValue({
		toasts: [
			{
				id: 0,
				header: "header1",
				body: "body1",
				show: true,
			},
		],
		setToasts: jest.fn(),
		handleAddToast: jest.fn(),
	});

	render(
		<ToastContextProvider>
			<DisplayToasts />
		</ToastContextProvider>
	);
	expect(screen.getByRole("alert")).toBeInTheDocument();
	expect(screen.getByText("header1")).toBeInTheDocument();
	expect(screen.getByText("body1")).toBeInTheDocument();
});

test("Modifies toast after timeout", async () => {
	let toasts = [
		{
			id: 0,
			header: "header1",
			body: "body1",
			show: true,
		},
	];
	const setToasts = jest.fn();
	useToasts.mockReturnValue({
		toasts,
		setToasts,
		handleAddToast: jest.fn(),
	});

	render(
		<ToastContextProvider>
			<DisplayToasts />
		</ToastContextProvider>
	);

	expect(screen.getByRole("alert")).toBeInTheDocument();

	await waitFor(() => expect(setToasts).toBeCalledTimes(1), {
		timeout: 5000,
	});
}, 6000);
