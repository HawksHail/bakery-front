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
	faUser,
	faHistory,
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
								<FontAwesomeIcon
									icon={faHome}
									className="me-1"
								/>
								Home
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link as={Link} eventKey="2" to="/category">
								<FontAwesomeIcon
									icon={faBookOpen}
									className="me-1"
								/>
								Category
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link as={Link} eventKey="3" to="/product">
								<FontAwesomeIcon
									icon={faCookie}
									className="me-1"
								/>
								Products
							</Nav.Link>
						</Nav.Item>
						{isAuthenticated && (
							<>
								<Nav.Item>
									<Nav.Link as={Link} eventKey="4" to="/cart">
										<FontAwesomeIcon
											icon={faShoppingCart}
											className="me-1"
										/>
										Cart
									</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link
										as={Link}
										eventKey="5"
										to="/orders"
									>
										<FontAwesomeIcon
											icon={faHistory}
											className="me-1"
										/>
										Orders
									</Nav.Link>
								</Nav.Item>

								<Nav.Item className="ms-0 ms-md-auto">
									<Nav.Link
										as={Link}
										eventKey="6"
										to="/profile"
										aria-label="Profile"
									>
										{customer ? (
											<span className="me-2">
												<FontAwesomeIcon
													icon={faUser}
													className="me-1"
												/>
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
							</>
						)}

						<Nav.Item
							className={
								isAuthenticated ? null : "ms-0 ms-md-auto"
							}
						>
							<AuthenticationButton />
						</Nav.Item>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default DisplayNavbar;
