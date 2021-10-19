export const getAllCategories = async () => {
	const res = await fetch("http://localhost:8091/category");
	return await res.json();
};

export const getCategory = async id => {
	const res = await fetch(`http://localhost:8091/category/${id}`);
	return await res.json();
};
