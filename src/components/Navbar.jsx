import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useAuth0 } from "@auth0/auth0-react";

import "../styles/Navbar.css";
import logo from "../logo.svg";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

function DisplayNavbar() {
	const { user, isAuthenticated } = useAuth0();

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
						{isAuthenticated && (
							<div>
								<LogoutButton />
								<img
									src={user.picture}
									alt={user.name}
									className="rounded-circle mx-2"
									height="40px"
									width="40px"
								/>
							</div>
						)}
						{!isAuthenticated && <LoginButton />}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default DisplayNavbar;
