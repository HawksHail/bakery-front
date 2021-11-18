import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Row, Alert } from "react-bootstrap";

import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import Loading from "./Loading";
import ProductCard from "./ProductCard";

function DisplayAllProducts({ history }) {
	const { products, setProducts, setCart, customer } = useContext(AppContext);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const [showAlert, setShowAlert] = useState(false);

	useEffect(() => {
		getAllProducts().then(setProducts).catch(console.log);
	}, []);

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

	const addToCartButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await addToCart(customer.customerId, prodId, accessToken).then(
				setCart
			);
			setShowAlert(true);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Row xs={1} sm={2} md={3} xl={4} xxl={5} className="g-2">
			<Alert
				className="fixed-bottom m-3 w-25"
				show={showAlert}
				variant="info"
				transition
				dismissible
				onClose={() => setShowAlert(false)}
			>
				<Alert.Heading>Item added!</Alert.Heading>
			</Alert>
			{products.length > 0 ? (
				products.map(product => (
					<ProductCard
						product={product}
						key={product.id}
						buttonText="Add to Cart"
						buttonClick={
							isAuthenticated
								? addToCartButton
								: () => {
										history.push("/login");
								  }
						}
					/>
				))
			) : (
				<h3 colSpan="4">
					<Loading />
				</h3>
			)}
		</Row>
	);
}

DisplayAllProducts.propTypes = {
	history: PropTypes.object,
};

export default withRouter(DisplayAllProducts);
