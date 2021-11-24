import React, { useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";

import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import ProductCardRow from "../components/ProductCardRow";

function ProductsPage({ history }) {
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
		<>
			<h1>All Products</h1>
			<ProductCardRow>
				<Alert
					className="fixed-bottom"
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
			</ProductCardRow>
		</>
	);
}

ProductsPage.propTypes = {
	history: PropTypes.object,
};

export default withRouter(ProductsPage);
