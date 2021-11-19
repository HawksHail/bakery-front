import React from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faHome,
	faShoppingCart,
	faCookie,
	faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../logo.svg";
import AuthenticationButton from "./AuthenticationButton";

function DisplayNavbar() {
	const { user, isAuthenticated } = useAuth0();

	return (
		<Navbar
			bg="dark"
			variant="dark"
			expand="md"
			fixed="top"
			collapseOnSelect
		>
			<Container fluid>
				<Navbar.Brand as={Link} to="/">
					<img
						className="brand rounded-circle"
						src={logo}
						alt="logo"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse
					id="basic-navbar-nav"
					className="justify-content-between"
				>
					<Nav className="me-auto mb-2 mb-lg-0">
						<Nav.Link as={Link} eventKey="1" to="/">
							<FontAwesomeIcon icon={faHome} />
							&nbsp;Home
						</Nav.Link>
						<Nav.Link as={Link} eventKey="2" to="/category">
							<FontAwesomeIcon icon={faBookOpen} />
							&nbsp;Category
						</Nav.Link>
						<Nav.Link as={Link} eventKey="3" to="/products">
							<FontAwesomeIcon icon={faCookie} />
							&nbsp;Products
						</Nav.Link>
						<Nav.Link as={Link} eventKey="4" to="/cart">
							<FontAwesomeIcon icon={faShoppingCart} />
							&nbsp;Cart
						</Nav.Link>
					</Nav>
					<Nav>
						<div className="hstack gap-2">
							<AuthenticationButton />
							{isAuthenticated && (
								<img
									src={user.picture}
									alt={user.name}
									className="rounded-circle"
									height="40px"
									width="40px"
								/>
							)}
						</div>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default DisplayNavbar;
