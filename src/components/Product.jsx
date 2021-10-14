import React from "react";

function Product(props) {
	return (
		<tr>
			<td>{props.product.productName}</td>
			<td>{props.product.categoryId}</td>
			<td>{props.product.supplierId}</td>
			<td>{props.product.unitPrice}</td>
		</tr>
	);
}

export default Product;
