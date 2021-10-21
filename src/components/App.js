import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";

import "../styles/App.css";
import Navbar from "./Navbar";
import Home from "./Home";
import DisplayAllProducts from "./DisplayAllProducts";
import DisplayCart from "./DisplayCart";
import DisplayAllCategories from "./DisplayAllCategories";
import DisplayCategoryItems from "./DisplayCategoryItems";

function App() {
	return (
		<Router>
			<Navbar />
			<Container fluid className="pt-1">
				<Switch>
					<Route exact path="/">
						<Home />
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
					<Route path="/cart">
						<DisplayCart />
					</Route>
				</Switch>
			</Container>
		</Router>
	);
}

export default App;
