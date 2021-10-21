import React from "react";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "../styles/Navbar.css";
import logo from "../logo.svg";

function DisplayNavbar() {
	return (
		<Navbar
			bg="dark"
			variant="dark"
			expand="sm"
			sticky="top"
			className="justify-content-between"
		>
			<Container>
				<Navbar.Brand as={Link} to="/">
					<img className="brand" src={logo} alt="logo" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
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
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default DisplayNavbar;
