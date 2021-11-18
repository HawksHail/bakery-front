/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams, withRouter } from "react-router";
import { Container, Breadcrumb, Row, Col, Image } from "react-bootstrap";

import Product from "../models/product";
import Loading from "./Loading";
import { getProduct } from "../api/productAPI";

function ProductPage(props) {
	const { id } = useParams();
	const [product, setProduct] = useState(null);

	console.log(`id`, id);

	useEffect(() => {
		getProduct(id).then(setProduct).catch(console.log);
	}, [id]);

	console.log(`product`, product);

	if (!product) {
		return (
			<h3>
				<Loading />
			</h3>
		);
	}

	return (
		<Container fluid>
			<Row>
				<Breadcrumb>
					<Breadcrumb.Item href="/category">
						Categories
					</Breadcrumb.Item>
					<Breadcrumb.Item
						href={`/category-items/${product.category.id}`}
					>
						{product.category.categoryName}
					</Breadcrumb.Item>
				</Breadcrumb>
			</Row>
			<Row>
				<Col>
					<a
						href={product.imgCredit ? product.imgCredit : null}
						target="_blank"
						rel="noreferrer"
					>
						<Image
							fluid
							rounded
							className="card-img-top mb-1"
							src={
								product.imgURL
									? product.imgURL
									: `https://picsum.photos/400/400?random=${product.id}`
							}
							alt={product.productName}
						/>
					</a>
				</Col>
				<Col>
					<Row>
						<h1>{product.productName}</h1>
					</Row>
					<Row>
						<p className="h4">By: {product.supplier.companyName}</p>
					</Row>
					<Row>
						<p className="h4">${product.unitPrice}</p>
					</Row>
				</Col>
			</Row>
		</Container>
	);
}

ProductPage.propTypes = {
	product: PropTypes.shape(Product),
};

export default withRouter(ProductPage);
/* eslint-enable no-unused-vars */
