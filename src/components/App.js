import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "../styles/App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import DisplayAllProducts from "./DisplayAllProducts";
import DisplayCart from "./DisplayCart";
import DisplayCategories from "./DisplayCategories";

function App() {
	return (
		<Router>
			<Navbar />
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route path="/category">
					<DisplayCategories />
				</Route>
				<Route path="/products">
					<DisplayAllProducts />
				</Route>
				<Route path="/cart">
					<DisplayCart />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;