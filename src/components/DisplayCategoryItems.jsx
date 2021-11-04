import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, withRouter } from "react-router";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";

import AppContext from "../contexts";
import { getCategory } from "../api/categoryAPI";
import { addToCart } from "../api/cartAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayCategoryItems({ history }) {
	const { id } = useParams();
	const [category, setCategory] = useState({});
	const { setCart, customer } = useContext(AppContext);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		getCategory(id).then(setCategory).catch(console.log);
	}, [id]);

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

	if (!category.productList) {
		return <div>Loading</div>;
	}

	return (
		<Row className="p-1">
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
