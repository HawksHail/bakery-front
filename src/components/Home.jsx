import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import logo from "../logo.svg";
import DisplayCarousel from "./DisplayCarousel";

function Home() {
	return (
		<main>
			<Container>
				<Row className="align-items-lg-center mb-4 mt-2">
					<Col className="col-8 mx-auto col-md-4 order-md-2 col-lg-5">
						<img
							className="img-fluid rounded-3 mb-3 mb-md-0"
							src={logo}
							width={400}
							height={400}
							alt="cupcake logo"
						/>
					</Col>
					<Col className="col-8 mx-auto col-md-4 order-md-1 col-lg-5">
						<h1>Welcome to Blissful&nbsp;Bakery</h1>
						<p className="lead">A small family owned bakery</p>
					</Col>
				</Row>
			</Container>
			<Container className="mb-5">
				<h2>Featured Products</h2>
				<DisplayCarousel
					arr={[
						{
							id: 1,
							src: "https://picsum.photos/800/400?random=1",
							title: "First item title",
							description: "First item description",
						},
						{
							id: 2,
							src: "https://picsum.photos/800/400?random=2",
							title: "Second item title",
							description: "Second item description",
						},
						{
							id: 3,
							src: "https://picsum.photos/800/400?random=3",
							title: "Third item title",
							description: "Third item description",
						},
					]}
				/>
			</Container>
		</main>
	);
}

export default Home;
