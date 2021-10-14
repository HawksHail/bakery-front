import React from "react";
import PropTypes from "prop-types";
import Product from "../models/product";

function DisplayProduct(props) {
	return (
		<tr>
			<td>{props.product.productName}</td>
			<td>{props.product.category.categoryName}</td>
			<td>{props.product.supplier.companyName}</td>
			<td>{props.product.unitPrice}</td>
		</tr>
	);
}

DisplayProduct.propTypes = {
	product: PropTypes.objectOf(Product),
};

export default DisplayProduct;
