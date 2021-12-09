import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Nav, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faInstagram,
	faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import { useAuth0 } from "@auth0/auth0-react";

import logo from "../logo.svg";
import AppContext from "../contexts";

function Footer() {
	const { getIdTokenClaims, isAuthenticated } = useAuth0();
	const { setAdminMode } = useContext(AppContext);
	const [roles, setRoles] = useState([]);

	useEffect(() => {
		async function getRoles() {
			const claims = await getIdTokenClaims();
			setRoles(claims?.["https://zion.ee-cognizantacademy.com/roles"]);
		}
		if (isAuthenticated) getRoles();
	}, [isAuthenticated]);

	const handleAdminSwitch = event => {
		setAdminMode(event.target.checked);
	};

	return (
		<footer className="mt-auto py-3 px-3 px-sm-5 border-top">
			<Row className="d-flex align-items-center text-center row-cols-3">
				<Col xs={7} sm={6} md={5} className="d-flex align-items-center">
					<Link to="/" className="me-2" aria-label="Home">
						<img src={logo} className="bi" width="30" height="30" />
					</Link>
					<span className="text-muted">
						© 2021 Blissful Bakery, Inc
					</span>
				</Col>
				<Col xs={3} sm={3} md={4} className="text-muted text-center">
					By <span className="font-monospace">Zion Mantey</span>
				</Col>
				<Col xs={2} sm={3} md={3}>
					<Nav
						as="ul"
						className="nav justify-content-end list-unstyled flex-column flex-sm-row"
					>
						<li className="ms-0 ms-sm-3" data-testid="social">
							<a
								aria-label="Twitter"
								className="text-muted"
								href="https://www.twitter.com"
							>
								<FontAwesomeIcon icon={faTwitter} size="lg" />
							</a>
						</li>
						<li className="ms-0 ms-sm-3" data-testid="social">
							<a
								aria-label="Instagram"
								className="text-muted"
								href="https://www.instagram.com"
							>
								<FontAwesomeIcon icon={faInstagram} size="lg" />
							</a>
						</li>
						<li className="ms-0 ms-sm-3" data-testid="social">
							<a
								aria-label="Facebook"
								className="text-muted"
								href="https://www.facebook.com"
							>
								<FontAwesomeIcon icon={faFacebook} size="lg" />
							</a>
						</li>
					</Nav>
				</Col>
			</Row>
			{roles && roles.includes("admin") ? (
				<Form.Switch label="Admin mode" onChange={handleAdminSwitch} />
			) : null}
		</footer>
	);
}

export default Footer;
