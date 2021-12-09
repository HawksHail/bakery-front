import React, { useState, useContext, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAsync } from "react-async";
import {
	Breadcrumb,
	Row,
	Col,
	Image,
	Button,
	Form,
	InputGroup,
	FloatingLabel,
} from "react-bootstrap";

import AppContext, { ProductContext, ToastContext } from "../contexts";
import Loading from "../components/Loading";
import { getProduct, updateProduct } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import { getAllSuppliers } from "../api/supplierAPI";
import { getAllCategories } from "../api/categoryAPI";

function ProductPage() {
	const { id } = useParams();
	const location = useLocation();
	const [product, setProduct] = useState(location.state?.product);
	const [productEdit, setProductEdit] = useState(product);
	const [quantity, setQuantity] = useState(1);
	const { setCart, customer, adminMode } = useContext(AppContext);
	const { categories, setCategories, suppliers, setSuppliers } =
		useContext(ProductContext);
	const { handleAddToast } = useContext(ToastContext);
	const history = useHistory();

	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	const { error: errorProduct } = useAsync({
		promiseFn: getProduct,
		id,
		onResolve: setProduct,
		onReject: console.error,
		initialValue: product ? product : null,
	});

	const { error: errorSupplier, run: runGetSuppliers } = useAsync({
		deferFn: getAllSuppliers,
		onResolve: setSuppliers,
		onReject: console.error,
		initialValue: suppliers,
	});

	const { error: errorCategory, run: runGetCategories } = useAsync({
		deferFn: getAllCategories,
		onResolve: setCategories,
		onReject: console.error,
		initialValue: categories,
	});

	const {
		isResolved: isResolvedSave,
		error: errorSave,
		run: runSaveProduct,
	} = useAsync({
		deferFn: updateProduct,
		onReject: console.error,
	});

	useEffect(() => {
		if (adminMode) {
			if (suppliers.length < 1) {
				runGetSuppliers();
			}
			if (categories.length < 1) {
				runGetCategories();
			}
			setProductEdit(product);
		}
	}, [adminMode, product]);

	useEffect(() => {
		if (isResolvedSave) {
			setProduct(productEdit);
			handleAddToast(
				"Saved!",
				"Product saved successfully",
				"primary",
				"text-white"
			);
		}
	}, [isResolvedSave]);

	useEffect(() => {
		if (errorCategory) {
			handleAddToast(
				"Error",
				"Failed to load categories",
				"danger",
				"text-white"
			);
		}
	}, [errorCategory]);

	useEffect(() => {
		if (errorSupplier) {
			handleAddToast(
				"Error",
				"Failed to load suppliers",
				"danger",
				"text-white"
			);
		}
	}, [errorSupplier]);

	useEffect(() => {
		if (errorSave) {
			handleAddToast(
				"Error",
				"Failed to save product",
				"danger",
				"text-white"
			);
		}
	}, [errorSave]);

	const handleAddToCart = async event => {
		event.preventDefault();
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await addToCart(
				customer.id,
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
			console.error("Error adding to cart", error);
		}
	};

	const handleSaveEdit = async () => {
		const accessToken = await getAccessTokenSilently({
			audience: "https://zion.ee-cognizantacademy.com",
		});
		runSaveProduct(productEdit, accessToken);
	};

	if (errorProduct) {
		return (
			<>
				<h2 className="text-danger">Error</h2>

				<p>
					HTTP {errorProduct.cause}: {errorProduct.message}
				</p>
			</>
		);
	}

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
							className="mb-1 shadow"
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
					<Row className="mb-3">
						{adminMode ? (
							<Form.Group controlId="formGroupName">
								<FloatingLabel label="Product Name">
									<Form.Control
										as="input"
										aria-label="Product Name"
										placeholder="Product Name"
										defaultValue={product.productName}
										onChange={event => {
											setProductEdit({
												...productEdit,
												productName: event.target.value,
											});
										}}
									/>
								</FloatingLabel>
							</Form.Group>
						) : (
							<h1>{product.productName}</h1>
						)}
					</Row>
					<Row className="mb-3">
						{adminMode ? (
							<Form.Group controlId="formGroupSupplier">
								<FloatingLabel label="Supplier">
									<Form.Select
										aria-label="Supplier"
										placeholder="Supplier"
										defaultValue={product.supplier.id}
										onChange={event => {
											const s = suppliers.find(
												e => e.id == event.target.value
											);
											setProductEdit({
												...productEdit,
												supplier: s,
											});
										}}
									>
										<option
											key={product.supplier.id}
											value={product.supplier.id}
										>
											{product.supplier.companyName}
										</option>
										{suppliers
											.filter(
												s => s.id != product.supplier.id
											)
											.map(s => (
												<option key={s.id} value={s.id}>
													{s.companyName}
												</option>
											))}
									</Form.Select>
								</FloatingLabel>
							</Form.Group>
						) : (
							<p className="h4">
								By: {product.supplier.companyName}
							</p>
						)}
					</Row>
					<Row className="mb-3">
						{adminMode ? (
							<Form.Group controlId="formGroupPrice">
								<FloatingLabel label="Price">
									<Form.Control
										as="input"
										type="number"
										aria-label="Price"
										placeholder="Price"
										defaultValue={product.unitPrice}
										onChange={event => {
											setProductEdit({
												...productEdit,
												unitPrice: event.target.value,
											});
										}}
									/>
								</FloatingLabel>
							</Form.Group>
						) : (
							<p className="h4">${product.unitPrice.toLocaleString(undefined, {
								minimumFractionDigits: 2,
							})}</p>
						)}
					</Row>
					{adminMode ? (
						<Row className="mb-3">
							<Form.Group controlId="formGroupCategory">
								<FloatingLabel label="Category">
									<Form.Select
										aria-label="Category"
										placeholder="Category"
										defaultValue={product.category.id}
										onChange={event => {
											const c = categories.find(
												e => e.id == event.target.value
											);
											setProductEdit({
												...productEdit,
												category: c,
											});
										}}
									>
										<option
											key={product.category.id}
											value={product.category.id}
										>
											{product.category.categoryName}
										</option>
										{categories
											.filter(
												c => c.id != product.category.id
											)
											.map(c => (
												<option key={c.id} value={c.id}>
													{c.categoryName}
												</option>
											))}
									</Form.Select>
								</FloatingLabel>
							</Form.Group>
						</Row>
					) : null}
					{adminMode ? (
						<Row className="mb-3">
							<div>
								<Button
									disabled={
										product.productName ===
											productEdit?.productName &&
										product.unitPrice ===
											productEdit?.unitPrice &&
										product.supplier.id ===
											productEdit?.supplier.id &&
										product.category.id ===
											productEdit?.category.id
									}
									onClick={handleSaveEdit}
								>
									Save
								</Button>
							</div>
						</Row>
					) : null}
					{adminMode ? null : (
						<Row className="mb-3">
							<Form
								onSubmit={
									isAuthenticated
										? handleAddToCart
										: () => {
												history.push("/login");
										  }
								}
								className="vstack gap-2"
							>
								<Button
									type="submit"
									style={{ width: "12rem" }}
								>
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
												setQuantity(
													Number(quantity) + 1
												);
											}}
										>
											+
										</Button>
									</InputGroup>
								</Form.Group>
							</Form>
						</Row>
					)}
				</Col>
			</Row>
		</>
	);
}

export default ProductPage;
