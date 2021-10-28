import React, { useEffect, useState, useContext } from "react";
import Row from "react-bootstrap/Row";

import AppContext from "../contexts";
import { useParams } from "react-router";
import { getCategory } from "../api/categoryAPI";
import { addToCart } from "../api/cartAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayCategoryItems() {
	const { id } = useParams();
	const [category, setCategory] = useState({});
	const { setCart } = useContext(AppContext);

	useEffect(() => {
		getCategory(id).then(setCategory).catch(console.log);
	}, [id]);

	//todo get custId from auth
	const custId = "test1";

	const addToCartButton = prodId => {
		console.log("addToCartButton", custId, prodId);
		addToCart(custId, prodId).then(setCart);
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
