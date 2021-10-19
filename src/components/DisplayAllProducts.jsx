import React, { useContext, useEffect } from "react";
import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayAllProducts() {
	const { products, setProducts } = useContext(AppContext);

	useEffect(() => {
		getAllProducts().then(setProducts).catch(console.log);
	}, []);

	return (
		<div className="row">
			{products.length > 0 ? (
				products.map(product => (
					<DisplayProduct product={product} key={product.id} />
				))
			) : (
				<div>
					<h3 colSpan="4">Loading</h3>
				</div>
			)}
		</div>
	);
}

export default DisplayAllProducts;
