import React from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-bootstrap";

function DisplayCarousel({ arr }) {
	if (!arr || arr.length < 1) {
		console.log("DisplayCarousel passed an empty array");
		return null;
	}

	return (
		<Carousel>
			{arr.map(item => (
				<Carousel.Item key={item.id}>
					<img
						className="d-block w-100"
						src={item.src}
						width={800}
						height={400}
						alt={item.title}
					/>
					<Carousel.Caption className="bg-primary bg-opacity-50">
						<h3>{item.title}</h3>
						<p>{item.description}</p>
					</Carousel.Caption>
				</Carousel.Item>
			))}
		</Carousel>
	);
}

DisplayCarousel.propTypes = {
	arr: PropTypes.array,
};

export default DisplayCarousel;
