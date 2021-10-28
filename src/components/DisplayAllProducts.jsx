import React, { useContext, useEffect } from "react";
import Row from "react-bootstrap/Row";

import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayAllProducts() {
	const { products, setProducts, setCart } = useContext(AppContext);

	useEffect(() => {
		getAllProducts().then(setProducts).catch(console.log);
	}, []);

	//todo get custId from auth
	const custId = "test1";

	const addToCartButton = prodId => {
		addToCart(custId, prodId).then(setCart);
	};

	return (
		<Row className="p-1">
			{products.length > 0 ? (
				products.map(product => (
					<DisplayProduct
						product={product}
						key={product.id}
						buttonText="Add to Cart"
						buttonClick={addToCartButton}
					/>
				))
			) : (
				<h3 colSpan="4">Loading</h3>
			)}
		</Row>
	);
}

export default DisplayAllProducts;
