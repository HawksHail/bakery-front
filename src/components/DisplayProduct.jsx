import React from "react";
import { Col, Button, Card, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

import Product from "../models/product";

function DisplayProduct(props) {
	const buttonClick = () => {
		props.buttonClick(props.product.id);
	};

	return (
		<Col xs={6} sm={4} md={3} lg={2} className="p-1">
			<Card className="m-2 h-100">
				<Card.Body className="d-flex align-items-start flex-column">
					<a
						href={
							props.product.imgCredit
								? props.product.imgCredit
								: null
						}
					>
						<img
							className="card-img-top img-fluid rounded-3 mb-1"
							src={
								props.product.imgURL
									? props.product.imgURL
									: `https://picsum.photos/400/400?random=${props.product.id}`
							}
							alt={props.product.productName}
						/>
					</a>
					<Card.Title>{props.product.productName}</Card.Title>
					<Card.Subtitle>
						{props.categoryName ||
							props.product.category.categoryName}
					</Card.Subtitle>
					<Card.Text>
						Sold by: {props.product.supplier.companyName}
					</Card.Text>
					<Card.Text className="mb-0">
						${props.product.unitPrice}
					</Card.Text>
					<Button
						className="w-100 mt-auto d-flex justify-content-around"
						onClick={buttonClick}
					>
						{props.buttonText}
						{props.quantity ? (
							<span>
								<Badge bg="secondary">{props.quantity}</Badge>
							</span>
						) : null}
					</Button>
				</Card.Body>
			</Card>
		</Col>
	);
}

DisplayProduct.propTypes = {
	product: PropTypes.objectOf(Product),
	categoryName: PropTypes.string,
	buttonClick: PropTypes.func,
	buttonText: PropTypes.string,
	quantity: PropTypes.number,
};

export default DisplayProduct;
