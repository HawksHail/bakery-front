import React from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import Product from "../models/product";

function DisplayProduct(props) {
	return (
		<Col xs={6} sm={4} md={3} lg={2} className="p-1">
			<Card className="m-2" data-testid="card">
				{/* <img
					className="card-img-top img-fluid p-5 p-sm-2"
					src="https://m.media-amazon.com/images/I/61KB6fUhcSL._AC_SL1500_.jpg"
					alt="{props.product.productName} image"
				/> */}
				<Card.Body>
					<Card.Title data-testid="productName">
						{props.product.productName}
					</Card.Title>
					<Card.Subtitle data-testid="categoryName">
						{props.categoryName ||
							props.product.category.categoryName}
					</Card.Subtitle>
					<Card.Text data-testid="companyName">
						Sold by: {props.product.supplier.companyName}
					</Card.Text>
					<Card.Text data-testid="unitPrice">
						${props.product.unitPrice}
					</Card.Text>
				</Card.Body>
			</Card>
		</Col>
	);
}

DisplayProduct.propTypes = {
	product: PropTypes.objectOf(Product),
	categoryName: PropTypes.string,
};

export default DisplayProduct;
