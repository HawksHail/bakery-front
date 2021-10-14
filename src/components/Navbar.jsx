import React from "react";
import { Link } from "react-router-dom";

import "../styles/Navbar.css";
import logo from "../logo.svg";

function Navbar() {
	return (
		<nav className="navbar navbar-expand-sm bg-dark navbar-dark justify-content-between">
			<Link className="navbar-brand" to="/">
				<img className="brand" src={logo} alt="logo" />
			</Link>
			<ul className="navbar-nav">
				<li className="nav-item">
					<Link to="/" className="nav-link">
						Home
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/category" className="nav-link">
						Category
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/products" className="nav-link">
						Products
					</Link>
				</li>
				<li className="nav-item">
					<Link to="/cart" className="nav-link">
						Cart
					</Link>
				</li>
			</ul>
		</nav>
	);
}

export default Navbar;
