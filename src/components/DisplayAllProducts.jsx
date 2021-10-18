import React, { useContext, useEffect } from "react";
import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayAllProducts() {
	const { products, setProducts } = useContext(AppContext);

	useEffect(() => {
		getAllProducts()
			.then(products => setProducts(products))
			.catch(error => console.log(error));
	}, []);

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
				{products.length > 0 ? (
					products.map(product => (
						<DisplayProduct product={product} key={product.id} />
					))
				) : (
					<div>Loading</div>
				)}
			</tbody>
		</table>
	);
}

export default DisplayAllProducts;
