import React from "react";
import { useHistory } from "react-router";
import { Container, Col, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTwitter,
	faInstagram,
	faFacebook,
} from "@fortawesome/free-brands-svg-icons";

import logo from "../logo.svg";

function Footer() {
	const history = useHistory();

	return (
		<Container>
			<footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
				<Col className="col-md-4 d-flex align-items-center">
					<a
						onClick={() => {
							history.push("/");
						}}
						style={{ cursor: "pointer" }}
						className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1"
					>
						<img src={logo} className="bi" width="30" height="30" />
					</a>
					<span className="text-muted">
						© 2021 Blissful Bakery, Inc
					</span>
				</Col>
				<span className="text-muted ">
					By <span className="font-monospace">Zion Mantey</span>
				</span>
				<Nav
					as="ul"
					className="nav col-md-4 justify-content-end list-unstyled d-flex"
				>
					<li className="ms-3" data-testid="social">
						<a className="text-muted" href="#">
							<FontAwesomeIcon icon={faTwitter} />
						</a>
					</li>
					<li className="ms-3" data-testid="social">
						<a className="text-muted" href="#">
							<FontAwesomeIcon icon={faInstagram} />
						</a>
					</li>
					<li className="ms-3" data-testid="social">
						<a className="text-muted" href="#">
							<FontAwesomeIcon icon={faFacebook} />
						</a>
					</li>
				</Nav>
			</footer>
		</Container>
	);
}

export default Footer;
