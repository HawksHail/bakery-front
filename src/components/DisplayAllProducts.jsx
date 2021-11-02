import React, { useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";

import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayAllProducts({ history }) {
	const { products, setProducts, setCart, customer } = useContext(AppContext);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		getAllProducts().then(setProducts).catch(console.log);
	}, []);

	const addToCartButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			addToCart(customer.customerId, prodId, accessToken).then(setCart);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Row className="p-1">
			{products.length > 0 ? (
				products.map(product => (
					<DisplayProduct
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
				<h3 colSpan="4">Loading</h3>
			)}
		</Row>
	);
}

DisplayAllProducts.propTypes = {
	history: PropTypes.object,
};

export default withRouter(DisplayAllProducts);
