import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import Loading from "../components/Loading";
import LoginButton from "../components/LoginButton";

function LoginPage(props) {
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
	if (isLoading) {
		return (
			<h2>
				<Loading />
			</h2>
		);
	}

	return (
		<>
			<h2>You must log in to do that!</h2>
			<LoginButton />
		</>
	);
}

LoginPage.propTypes = {
	props: PropTypes.object,
	history: PropTypes.object,
	location: PropTypes.object,
};

export default withRouter(LoginPage);
