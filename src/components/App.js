import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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

function App() {
	return (
		<Router>
			<Navbar />
			<Container
				fluid
				className="pt-1 d-flex flex-column justify-content-between"
				style={{ minHeight: "100vh" }}
			>
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
			</Container>
			<Footer />
		</Router>
	);
}

export default App;
