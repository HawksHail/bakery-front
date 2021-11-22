import React from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

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
						className="d-block w-100 rounded-3"
						src={item.imgURL}
						alt={item.productName}
					/>
					<Carousel.Caption className="bg-primary bg-opacity-50">
						<Link
							to={`/product/${item.id}`}
							className="link-secondary"
						>
							<h3>{item.productName}</h3>
						</Link>
						<Link
							to={`/category/${item.category.id}`}
							className="text-secondary"
						>
							{item.category.categoryName}
						</Link>
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
