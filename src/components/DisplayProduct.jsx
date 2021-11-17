import React from "react";
import { Col, Button, Card, Badge, Image } from "react-bootstrap";
import PropTypes from "prop-types";

import Product from "../models/product";

function DisplayProduct(props) {
	const buttonClick = () => {
		props.buttonClick(props.product.id);
	};

	return (
		<Col xs={12} sm={4} md={3} xl={2} className="p-1">
			<Card className="productCard h-100">
				<Card.Body className="d-flex flex-column align-items-center text-center">
					<a
						href={
							props.product.imgCredit
								? props.product.imgCredit
								: null
						}
						target="_blank"
						rel="noreferrer"
					>
						<Image
							fluid
							rounded
							className="card-img-top mb-1"
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
						By: {props.product.supplier.companyName}
					</Card.Text>
					<Card.Text className="mb-0">
						${props.product.unitPrice}
					</Card.Text>
					<Button
						className="w-75 mt-auto mx-4 d-flex justify-content-around"
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
	product: PropTypes.shape(Product),
	categoryName: PropTypes.string,
	buttonClick: PropTypes.func,
	buttonText: PropTypes.string,
	quantity: PropTypes.number,
};

export default DisplayProduct;
