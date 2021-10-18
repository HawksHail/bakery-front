import React from "react";
import PropTypes from "prop-types";
import Product from "../models/product";

function DisplayProduct(props) {
	return (
		<div className="col-6 col-sm-4 col-md-3 col-lg-2 p-1">
			<div className="card m-1">
				{/* <img
					className="card-img-top img-fluid p-5 p-sm-2"
					src="https://m.media-amazon.com/images/I/61KB6fUhcSL._AC_SL1500_.jpg"
					alt="{props.product.productName} image"
				/> */}
				<div className="card-body">
					<h5 className="card-title">{props.product.productName}</h5>
					<p>
						<em>{props.product.category.categoryName}</em>
					</p>
					<p>Sold by: {props.product.supplier.companyName}</p>
					<p>${props.product.unitPrice}</p>
				</div>
			</div>
		</div>
	);
}

DisplayProduct.propTypes = {
	product: PropTypes.objectOf(Product),
};

export default DisplayProduct;
