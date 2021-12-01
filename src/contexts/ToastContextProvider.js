import React from "react";
import PropTypes from "prop-types";

import { ToastContext } from ".";
import useToasts from "../hooks/useToasts";

const ToastContextProvider = ({ children }) => {
	const result = useToasts();

	return (
		<ToastContext.Provider value={result}>{children}</ToastContext.Provider>
	);
};

ToastContextProvider.propTypes = {
	children: PropTypes.node,
};

export default ToastContextProvider;
