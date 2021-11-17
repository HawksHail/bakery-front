import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Container from "react-bootstrap/Container";

import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import DisplayAllProducts from "./DisplayAllProducts";
import DisplayCart from "./DisplayCart";
import DisplayAllCategories from "./DisplayAllCategories";
import DisplayCategoryItems from "./DisplayCategoryItems";
import PrivateRoute from "./PrivateRoute";
import Footer from "./Footer";
import AppContext from "../contexts";
import { getCustomerIdFromSub, createCustomer } from "../api/customerAPI";

function App() {
	const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
	const { setCustomer } = useContext(AppContext);

	useEffect(async () => {
		if (isAuthenticated && user?.sub) {
			try {
				const accessToken = await getAccessTokenSilently({
					audience: "https://zion.ee-cognizantacademy.com",
				});

				let customer;
				try {
					customer = await getCustomerIdFromSub(
						user.sub,
						accessToken
					);
				} catch (error) {
					//create customer w/ API
					if (error.message == 404) {
						customer = await createCustomer(user.sub, accessToken);
					} else {
						throw error;
					}
				}
				setCustomer(customer);
			} catch (error) {
				console.log("Error getting customer", error);
			}
		}
	}, [user]);

	return (
		<Router>
			<Navbar />
			<Container fluid style={{ minHeight: "100vh" }}>
				<main className="mx-3">
					<Switch>
						<Route exact path="/">
							<Home />
						</Route>
						<Route path="/login">
							<Login />
						</Route>
						<Route path="/category">
							<DisplayAllCategories />
						</Route>
						<Route path="/category-items/:id">
							<DisplayCategoryItems />
						</Route>
						<Route path="/products">
							<DisplayAllProducts />
						</Route>
						<PrivateRoute path="/cart">
							<DisplayCart />
						</PrivateRoute>
					</Switch>
				</main>
			</Container>
			<Footer />
		</Router>
	);
}

export default App;
