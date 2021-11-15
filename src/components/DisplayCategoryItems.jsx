import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, withRouter } from "react-router";
import PropTypes from "prop-types";
import { Row, Alert } from "react-bootstrap";

import AppContext from "../contexts";
import { getCategory } from "../api/categoryAPI";
import { addToCart } from "../api/cartAPI";
import DisplayProduct from "./DisplayProduct";
import Loading from "./Loading";

function DisplayCategoryItems({ history }) {
	const { id } = useParams();
	const [category, setCategory] = useState({});
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
		} else if (!showAlert) {
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

	if (!category.productList) {
		return <div><Loading/></div>;
	}

	return (
		<Row className="p-1">
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
				<DisplayProduct
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
