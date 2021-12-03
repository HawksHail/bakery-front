import React from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function DisplayCarousel({ arr }) {
	if (!arr || arr.length < 1) {
		return null;
	}

	return (
		<Carousel>
			{arr.map(product => (
				<Carousel.Item key={product.id}>
					<img
						className="d-block w-100 rounded-3"
						src={product.imgURL}
						alt={product.productName}
					/>
					<Carousel.Caption className="bg-primary bg-opacity-50">
						<Link
							to={{
								pathname: `/product/${product.id}`,
								state: { product: product },
							}}
							className="link-secondary"
						>
							<h3>{product.productName}</h3>
						</Link>
						<Link
							to={{
								pathname: `/category/${product.category.id}`,
								state: { category: product.category },
							}}
							className="text-secondary"
						>
							{product.category.categoryName}
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
