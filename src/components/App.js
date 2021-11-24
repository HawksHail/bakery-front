import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Container from "react-bootstrap/Container";

import AppContext from "../contexts";
import Navbar from "./Navbar";
import Footer from "./Footer";
import LoginPage from "../page/LoginPage";
import HomePage from "../page/HomePage";
import CategoriesPage from "../page/CategoriesPage";
import CategoryPage from "../page/CategoryPage";
import ProductsPage from "../page/ProductsPage";
import ProductPage from "../page/ProductPage";
import CartPage from "../page/CartPage";
import ProfilePage from "../page/ProfilePage";
import PrivateRoute from "./PrivateRoute";
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
			<Container as="main" fluid className="mb-3">
				<Switch>
					<Route exact path="/">
						<HomePage />
					</Route>
					<Route path="/login">
						<LoginPage />
					</Route>
					<Route exact path="/category">
						<CategoriesPage />
					</Route>
					<Route path="/category/:id">
						<CategoryPage />
					</Route>
					<Route exact path="/product">
						<ProductsPage />
					</Route>
					<Route path="/product/:id">
						<ProductPage />
					</Route>
					<PrivateRoute path="/cart">
						<CartPage />
					</PrivateRoute>
					<PrivateRoute path="/profile">
						<ProfilePage />
					</PrivateRoute>
				</Switch>
			</Container>
			<Footer />
		</Router>
	);
}

export default App;
