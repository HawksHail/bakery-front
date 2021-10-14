import React, { useContext, useEffect } from "react";
import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import Product from "./Product";

function DisplayAllProducts() {
	const { products, setProducts } = useContext(AppContext);

	useEffect(() => {
		console.log("All products");
		getAllProducts()
			.then(products => setProducts(products))
			.catch(error => console.log(error));
	}, [products, setProducts]);

	return (
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Product Name</th>
					<th>Category</th>
					<th>Supplier</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>
				{products.map(product => (
					<Product product={product} key={product.productId} />
				))}
			</tbody>
		</table>
	);
}

export default DisplayAllProducts;