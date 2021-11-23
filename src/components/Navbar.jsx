import React, { useContext } from "react";
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
import AppContext from "../contexts";

function DisplayNavbar() {
	const { user, isAuthenticated } = useAuth0();
	const { customer } = useContext(AppContext);

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
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="flex-fill mb-2 mb-lg-0 align-items-center">
						<Nav.Item>
							<Nav.Link as={Link} eventKey="1" to="/">
								<FontAwesomeIcon icon={faHome} />
								&nbsp;Home
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link as={Link} eventKey="2" to="/category">
								<FontAwesomeIcon icon={faBookOpen} />
								&nbsp;Category
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link as={Link} eventKey="3" to="/product">
								<FontAwesomeIcon icon={faCookie} />
								&nbsp;Products
							</Nav.Link>
						</Nav.Item>
						<Nav.Item className="me-0 me-md-auto">
							<Nav.Link as={Link} eventKey="4" to="/cart">
								<FontAwesomeIcon icon={faShoppingCart} />
								&nbsp;Cart
							</Nav.Link>
						</Nav.Item>
						{isAuthenticated && (
							<Nav.Item>
								<Nav.Link
									as={Link}
									eventKey="5"
									to="/profile"
									aria-label="Profile"
								>
									{customer ? (
										<span className="me-2">
											{customer.contactName
												? customer.contactName
												: "Profile"}
										</span>
									) : null}
									<img
										src={user.picture}
										alt={user.name}
										className="rounded-circle"
										height="40px"
										width="40px"
									/>
								</Nav.Link>
							</Nav.Item>
						)}
						<Nav.Item>
							<AuthenticationButton />
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default DisplayNavbar;
