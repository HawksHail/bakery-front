import React, { useEffect, useState, useContext } from "react";
import Row from "react-bootstrap/Row";
import { useAuth0 } from "@auth0/auth0-react";

import AppContext from "../contexts";
import { useParams } from "react-router";
import { getCategory } from "../api/categoryAPI";
import { addToCart } from "../api/cartAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayCategoryItems() {
	const { id } = useParams();
	const [category, setCategory] = useState({});
	const { setCart } = useContext(AppContext);
	const { getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		getCategory(id).then(setCategory).catch(console.log);
	}, [id]);

	//todo get custId from auth
	const custId = 90;

	const addToCartButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			addToCart(custId, prodId, accessToken).then(setCart);
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
					buttonClick={addToCartButton}
				/>
			))}
		</Row>
	);
}

export default DisplayCategoryItems;
