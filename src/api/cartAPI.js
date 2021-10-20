export const getCart = async id => {
	const res = await fetch(`http://localhost:8089/cart/${id}`);
	return await res.json();
};
