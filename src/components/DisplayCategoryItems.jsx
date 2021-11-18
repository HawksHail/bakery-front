import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, withRouter } from "react-router";
import PropTypes from "prop-types";
import { Row, Alert } from "react-bootstrap";

import AppContext from "../contexts";
import { getCategory } from "../api/categoryAPI";
import { addToCart } from "../api/cartAPI";
import ProductCard from "./ProductCard";
import Loading from "./Loading";

function DisplayCategoryItems({ history }) {
	const { id } = useParams();
	const [category, setCategory] = useState(null);
	const { setCart, customer } = useContext(AppContext);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const [showAlert, setShowAlert] = useState(false);

	useEffect(() => {
		getCategory(id).then(setCategory).catch(console.log);
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

	const addToCartButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await addToCart(customer.customerId, prodId, accessToken)
				.then(setCart)
				.catch(e => console.log("Error posting cart", e));
			setShowAlert(true);
		} catch (error) {
			console.log("Error adding to cart", error);
		}
	};

	if (!category?.productList) {
		return (
			<div>
				<Loading />
			</div>
		);
	}

	return (
		<Row>
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
			{category.productList.map(product => (
				<ProductCard
					product={product}
					key={product.id}
					categoryName={category.categoryName}
					buttonText="Add to Cart"
					buttonClick={
						isAuthenticated
							? addToCartButton
							: () => {
									history.push("/login");
							  }
					}
				/>
			))}
		</Row>
	);
}

DisplayCategoryItems.propTypes = {
	history: PropTypes.object,
};

export default withRouter(DisplayCategoryItems);
