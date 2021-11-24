import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";

import logo from "../logo.svg";
import { getFeaturedProducts } from "../api/productAPI";
import DisplayCarousel from "../components/DisplayCarousel";

function HomePage() {
	const [featured, setFeatured] = useState([]);

	useEffect(() => {
		getFeaturedProducts().then(setFeatured).catch(console.log);
	}, []);

	return (
		<>
			<Container>
				<Row className="align-items-lg-center mb-4 mt-2">
					<Col className="mx-auto col-9 col-md-4 col-lg-5 order-md-2">
						<img
							className="img-fluid rounded-3 mb-3 mb-md-0"
							src={logo}
							width={400}
							height={400}
							alt="cupcake logo"
						/>
					</Col>
					<Col className="mx-auto col-9 col-md-4 col-lg-5 order-md-1">
						<h1>Welcome to Blissful&nbsp;Bakery</h1>
						<p className="lead">A small family owned bakery</p>
					</Col>
				</Row>
			</Container>
			<Container className="mb-5">
				<Row>
					<Col className="mx-auto col-12 col-md-10 col-lg-8">
						<h2>Featured Products</h2>
						<DisplayCarousel arr={featured} />
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default HomePage;
