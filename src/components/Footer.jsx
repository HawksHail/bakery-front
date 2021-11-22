import React from "react";
import { useHistory } from "react-router";
import { Row, Col, Nav } from "react-bootstrap";
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
		<footer className="mt-auto py-3 px-3 px-sm-5 border-top">
			<Row className="d-flex align-items-center text-center row-cols-3">
				<Col xs={7} sm={6} md={5} className="d-flex align-items-center">
					<a
						onClick={() => {
							history.push("/");
						}}
						style={{ cursor: "pointer" }}
						className="me-2"
					>
						<img src={logo} className="bi" width="30" height="30" />
					</a>
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
								className="text-muted"
								href="https://www.twitter.com"
							>
								<FontAwesomeIcon icon={faTwitter} size="lg" />
							</a>
						</li>
						<li className="ms-0 ms-sm-3" data-testid="social">
							<a
								className="text-muted"
								href="https://www.instagram.com"
							>
								<FontAwesomeIcon icon={faInstagram} size="lg" />
							</a>
						</li>
						<li className="ms-0 ms-sm-3" data-testid="social">
							<a
								className="text-muted"
								href="https://www.facebook.com"
							>
								<FontAwesomeIcon icon={faFacebook} size="lg" />
							</a>
						</li>
					</Nav>
				</Col>
			</Row>
		</footer>
	);
}

export default Footer;
