import { renderHook, act } from "@testing-library/react-hooks";

import useToasts from "../../hooks/useToasts";

test("Starts empty", () => {
	const { result } = renderHook(() => useToasts());

	expect(result.current.toasts).toEqual([]);
});

test("handleAddToast adds to the array", () => {
	const { result } = renderHook(() => useToasts());

	act(() => {
		result.current.handleAddToast("header1", "body1");
	});

	expect(result.current.toasts).toEqual([
		{
			id: 0,
			header: "header1",
			body: "body1",
			show: true,
		},
	]);
});

test("handleAddToast adds multiple to the array", () => {
	const { result } = renderHook(() => useToasts());

	act(() => {
		result.current.handleAddToast("header1", "body1");
	});
	act(() => {
		result.current.handleAddToast();
	});

	expect(result.current.toasts).toEqual([
		{
			id: 0,
			header: "header1",
			body: "body1",
			show: true,
		},
		{
			id: 1,
			header: "",
			body: "",
			show: true,
		},
	]);
});

test("Removes hidden old toasts", () => {
	const { result } = renderHook(() => useToasts());

	act(() => {
		result.current.handleAddToast("header1", "body1");
	});
	act(() => {
		result.current.handleAddToast("header2", "body2");
	});

	act(() => {
		const arr = [...result.current.toasts];
		arr[1].show = false;
		result.current.setToasts([...arr]);
	});

	expect(result.current.toasts).toEqual([
		{
			id: 0,
			header: "header1",
			body: "body1",
			show: true,
		},
	]);
});
