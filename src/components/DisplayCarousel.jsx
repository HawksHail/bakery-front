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
						className="d-block w-100 rounded-3"
						src={item.imgURL}
						alt={item.productName}
					/>
					<Carousel.Caption className="bg-primary bg-opacity-50">
						<h3>{item.productName}</h3>
						<a
							href={`/category-items/${item.category.id}`}
							className="text-secondary"
						>
							<p>{item.category.categoryName}</p>
						</a>
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
