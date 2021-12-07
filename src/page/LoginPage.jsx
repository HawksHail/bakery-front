import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory, useLocation } from "react-router";

import Loading from "../components/Loading";
import LoginButton from "../components/LoginButton";

function LoginPage() {
	const { isAuthenticated, isLoading } = useAuth0();
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
		if (!isLoading && isAuthenticated) {
			if (location.state?.from) {
				history.push(location.state.from);
			} else {
				history.push("/");
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

export default LoginPage;
