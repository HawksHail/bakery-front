import React, { useEffect, useState, useContext } from "react";
import { useParams, withRouter } from "react-router";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
	Breadcrumb,
	Row,
	Col,
	Image,
	Button,
	Form,
	InputGroup,
} from "react-bootstrap";

import AppContext, { ToastContext } from "../contexts";
import Loading from "../components/Loading";
import { getProduct } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";

function ProductPage() {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [quantity, setQuantity] = useState(1);
	const { setCart, customer } = useContext(AppContext);
	const { handleAddToast } = useContext(ToastContext);

	const { getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		getProduct(id).then(setProduct).catch(console.log);
	}, [id]);

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
			handleAddToast(
				"Item(s) added!",
				`${quantity} ${product.productName} added to cart!`,
				"primary",
				"text-white"
			);
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
			<Row>
				<Breadcrumb>
					<Breadcrumb.Item
						linkAs={Link}
						linkProps={{ to: "/category" }}
					>
						Category
					</Breadcrumb.Item>
					<Breadcrumb.Item
						linkAs={Link}
						linkProps={{ to: `/category/${product.category.id}` }}
					>
						{product.category.categoryName}
					</Breadcrumb.Item>
					<Breadcrumb.Item active>
						{product.productName}
					</Breadcrumb.Item>
				</Breadcrumb>
			</Row>
			<Row xs={1} sm={2}>
				<Col md={5} lg={4}>
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
				<Col md={7} lg={8}>
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

export default withRouter(ProductPage);
