import React, { useState } from "react";
import PropTypes from "prop-types";

import AppContext from ".";

const AppContextProvider = ({ children }) => {
	const [cart, setCart] = useState(null);
	const [customer, setCustomer] = useState(null);
	const [adminMode, setAdminMode] = useState(false);

	const context = {
		cart,
		setCart,
		customer,
		setCustomer,
		adminMode,
		setAdminMode,
	};

	return (
		<AppContext.Provider value={context}>{children}</AppContext.Provider>
	);
};

AppContextProvider.propTypes = {
	children: PropTypes.node,
};

export default AppContextProvider;
