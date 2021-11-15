import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import PropTypes from "prop-types";

function PrivateRoute({ children, ...rest }) {
	const { isAuthenticated } = useAuth0();

	return (
		<Route
			{...rest}
			render={({ location }) => {
				return isAuthenticated ? (
					children
				) : (
					<Redirect
						to={{
							pathname: "/login",
							state: { from: location },
						}}
					/>
				);
			}}
		/>
	);
}

PrivateRoute.propTypes = {
	children: PropTypes.node,
	rest: PropTypes.any,
};

export default PrivateRoute;
