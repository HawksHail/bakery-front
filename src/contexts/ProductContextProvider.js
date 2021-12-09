import React, { useState } from "react";
import PropTypes from "prop-types";

import { ProductContext } from ".";

const ProductContextProvider = ({ children }) => {
	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [suppliers, setSuppliers] = useState([]);

	const context = {
		products,
		setProducts,
		categories,
		setCategories,
		suppliers,
		setSuppliers,
	};

	return (
		<ProductContext.Provider value={context}>
			{children}
		</ProductContext.Provider>
	);
};

ProductContextProvider.propTypes = {
	children: PropTypes.node,
};

export default ProductContextProvider;
