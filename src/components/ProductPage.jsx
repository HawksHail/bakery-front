import React, { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { useParams, withRouter } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import {
	Breadcrumb,
	Row,
	Col,
	Image,
	Button,
	Form,
	InputGroup,
	Alert,
} from "react-bootstrap";

import AppContext from "../contexts";
import Product from "../models/product";
import Loading from "./Loading";
import { getProduct } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";

function ProductPage() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const [showAlert, setShowAlert] = useState(false);
	const { setCart, customer } = useContext(AppContext);

	const { getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		getProduct(id).then(setProduct).catch(console.log);
	}, [id]);

	useEffect(() => {
		let interval = null;
		if (showAlert) {
			interval = setInterval(() => {
				setShowAlert(false);
			}, 4500);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [showAlert]);

	const handleAddToCart = async event => {
		event.preventDefault();
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await addToCart(
				customer.customerId,
				product.id,
				accessToken,
				quantity
			).then(setCart);
			setShowAlert(true);
		} catch (error) {
			console.log(error);
		}
	};

	if (!product) {
		return (
			<h3>
				<Loading />
			</h3>
		);
	}

	return (
		<>
			<Alert
				className="fixed-bottom m-3 w-25"
				show={showAlert}
				variant="danger"
				transition
				dismissible
				onClose={() => setShowAlert(false)}
			>
				<Alert.Heading>Item added!</Alert.Heading>
			</Alert>
			<Row>
				<Breadcrumb>
					<Breadcrumb.Item href="/category">Category</Breadcrumb.Item>
					<Breadcrumb.Item
						href={`/category-items/${product.category.id}`}
					>
						{product.category.categoryName}
					</Breadcrumb.Item>
					<Breadcrumb.Item active>
						{product.productName}
					</Breadcrumb.Item>
				</Breadcrumb>
			</Row>
			<Row xs={1} sm={2}>
				<Col lg={4}>
					<a
						href={product.imgCredit ? product.imgCredit : null}
						target="_blank"
						rel="noreferrer"
					>
						<Image
							fluid
							rounded
							className="mb-1"
							src={
								product.imgURL
									? product.imgURL
									: `https://picsum.photos/400/400?random=${product.id}`
							}
							alt={product.productName}
						/>
					</a>
				</Col>
				<Col md={7}>
					<Row>
						<h1>{product.productName}</h1>
					</Row>
					<Row>
						<p className="h4">By: {product.supplier.companyName}</p>
					</Row>
					<Row>
						<p className="h4">${product.unitPrice}</p>
					</Row>
					<Row>
						<Form
							onSubmit={handleAddToCart}
							className="vstack gap-2"
						>
							<Button type="submit" style={{ width: "12rem" }}>
								Add&nbsp;to&nbsp;cart
							</Button>
							<Form.Group style={{ width: "12rem" }}>
								<InputGroup>
									<Button
										style={{ width: "3rem" }}
										onClick={() => {
											quantity > 1
												? setQuantity(
														Number(quantity) - 1
												  )
												: null;
										}}
									>
										-
									</Button>
									<Form.Control
										aria-label="quantity"
										className="text-center"
										type="number"
										value={quantity}
										min={1}
										onChange={e => {
											setQuantity(e.target.value);
										}}
									/>
									<Button
										style={{ width: "3rem" }}
										onClick={() => {
											setQuantity(Number(quantity) + 1);
										}}
									>
										+
									</Button>
								</InputGroup>
							</Form.Group>
						</Form>
					</Row>
				</Col>
			</Row>
		</>
	);
}

ProductPage.propTypes = {
	product: PropTypes.shape(Product),
};

export default withRouter(ProductPage);
