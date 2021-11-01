import React, { useState } from "react";
import PropTypes from "react";

import AppContext from ".";

const CustomerContextProvider = ({ children }) => {
	const [customer, setCustomer] = useState({});

	const context = {
		customer,
		setCustomer,
	};

	return (
		<AppContext.Provider value={context}>{children}</AppContext.Provider>
	);
};

CustomerContextProvider.propTypes = {
	children: PropTypes.Component,
};

export default CustomerContextProvider;
