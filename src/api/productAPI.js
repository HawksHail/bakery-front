export const getAllProducts = async () => {
	const res = await fetch("http://localhost:8091/product");
	return await res.json();
};
