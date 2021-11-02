import React, { useState } from "react";
import PropTypes from "react";

import AppContext from ".";

const ProductsContextProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [cart, setCart] = useState({});
	const [customer, setCustomer] = useState(null);


	const context = {
		products,
		setProducts,
		categories,
		setCategories,
		cart,
		setCart,
		customer,
		setCustomer,
	};

	return (
		<AppContext.Provider value={context}>{children}</AppContext.Provider>
	);
};

ProductsContextProvider.propTypes = {
	children: PropTypes.Component,
};

export default ProductsContextProvider;
