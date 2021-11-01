import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useAuth0 } from "@auth0/auth0-react";

import "../styles/Navbar.css";
import logo from "../logo.svg";
import AuthenticationButton from "./AuthenticationButton";
import AppContext from "../contexts/index";
import { getCustomerIdFromSub } from "../api/customerAPI";

function DisplayNavbar() {
	const { user, isAuthenticated } = useAuth0();
	const { setCustomer } = useContext(AppContext);

	useEffect(async () => {
		if (user?.sub) {
			try {
				const customer = await getCustomerIdFromSub(user.sub);
				setCustomer(customer);
			} catch (error) {
				console.log(error);
			}
		}
	}, [user]);

	console.log(user);

	return (
		<Navbar bg="dark" variant="dark" expand="sm" sticky="top">
			<Container fluid>
				<Navbar.Brand as={Link} to="/">
					<img className="brand" src={logo} alt="logo" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse
					id="basic-navbar-nav"
					className="justify-content-between"
				>
					<Nav className="me-auto mb-2 mb-lg-0">
						<Nav.Link as={Link} to="/">
							Home
						</Nav.Link>
						<Nav.Link as={Link} to="/category">
							Category
						</Nav.Link>
						<Nav.Link as={Link} to="/products">
							Products
						</Nav.Link>
						<Nav.Link as={Link} to="/cart">
							Cart
						</Nav.Link>
					</Nav>
					<Nav>
						<AuthenticationButton />
						{isAuthenticated && (
							<img
								src={user.picture}
								alt={user.name}
								className="rounded-circle mx-2"
								height="40px"
								width="40px"
							/>
						)}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default DisplayNavbar;
