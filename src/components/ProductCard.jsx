import React from "react";
import { Col, Button, Card, Badge, Image } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Product from "../models/product";

function ProductCard(props) {
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
							className="card-img-top mb-1 shadow"
							src={
								props.product.imgURL
									? props.product.imgURL
									: `https://picsum.photos/400/400?random=${props.product.id}`
							}
							alt={props.product.productName}
						/>
					</a>
					<Card.Title>
						<Link
							to={{
								pathname: `/product/${props.product.id}`,
								state: { product: props.product },
							}}
						>
							{props.product.productName}
						</Link>
					</Card.Title>
					<Card.Subtitle>
						{props.categoryName ||
							props.product.category.categoryName}
					</Card.Subtitle>
					<Card.Text>
						By: {props.product.supplier.companyName}
					</Card.Text>
					<Card.Text>
						$
						{props.product.unitPrice.toLocaleString(undefined, {
							minimumFractionDigits: 2,
						})}
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
