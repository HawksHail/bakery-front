export const getAllCategories = async () => {
	const res = await fetch("http://localhost:8091/category");
	return await res.json();
};
