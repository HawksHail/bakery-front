import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import Loading from "./Loading";

function Login(props) {
	const { isAuthenticated, isLoading } = useAuth0();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			if (props.location.state?.from) {
				props.history.push(props.location.state.from);
			} else {
				props.history.push("/");
			}
		}
	}, [isAuthenticated, isLoading]);

	return <h2>{isLoading ? <Loading /> : "You must log in to do that!"}</h2>;
}

Login.propTypes = {
	props: PropTypes.object,
	history: PropTypes.object,
	location: PropTypes.object,
};

export default withRouter(Login);
