import React from "react";
import { Col, Button, Card, Badge, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { useHistory } from "react-router";

import Product from "../models/product";

function ProductCard(props) {
	const history = useHistory();
	const buttonClick = () => {
		props.buttonClick(props.product.id);
	};

	return (
		<Col>
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
					<Card.Title>
						<a
							className="link-primary"
							style={{ cursor: "pointer" }}
							onClick={() =>
								history.push(`/product/${props.product.id}`)
							}
						>
							{props.product.productName}
						</a>
					</Card.Title>
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

ProductCard.propTypes = {
	product: PropTypes.shape(Product),
	categoryName: PropTypes.string,
	buttonClick: PropTypes.func,
	buttonText: PropTypes.string,
	quantity: PropTypes.number,
};

export default ProductCard;
