import React, { useState } from "react";
import PropTypes from "prop-types";

import AppContext from ".";

const AppContextProvider = ({ children }) => {
	const [categories, setCategories] = useState([]);
	const [cart, setCart] = useState(null);
	const [customer, setCustomer] = useState(null);

	const context = {
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

AppContextProvider.propTypes = {
	children: PropTypes.node,
};

export default AppContextProvider;
