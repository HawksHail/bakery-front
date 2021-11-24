import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, withRouter } from "react-router";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Alert, Breadcrumb } from "react-bootstrap";

import AppContext from "../contexts";
import { getCategory } from "../api/categoryAPI";
import { addToCart } from "../api/cartAPI";
import ProductCard from "../components/ProductCard";
import ProductCardRow from "../components/ProductCardRow";
import Loading from "../components/Loading";

function CategoryPage({ history }) {
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
		<>
			<h1>{category.categoryName}</h1>
			<Breadcrumb>
				<Breadcrumb.Item linkAs={Link} linkProps={{ to: "/category" }}>
					Category
				</Breadcrumb.Item>
				<Breadcrumb.Item active>
					{category.categoryName}
				</Breadcrumb.Item>
			</Breadcrumb>
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
			</ProductCardRow>
		</>
	);
}

CategoryPage.propTypes = {
	history: PropTypes.object,
};

export default withRouter(CategoryPage);
