import React, { useContext, useEffect } from "react";
import Row from "react-bootstrap/Row";

import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayAllProducts() {
	const { products, setProducts } = useContext(AppContext);

	useEffect(() => {
		getAllProducts().then(setProducts).catch(console.log);
	}, []);

	return (
		<Row className="p-1">
			{products.length > 0 ? (
				products.map(product => (
					<DisplayProduct product={product} key={product.id} />
				))
			) : (
				<h3 colSpan="4">Loading</h3>
			)}
		</Row>
	);
}

export default DisplayAllProducts;
