import React from "react";
import PropTypes from "prop-types";
import Product from "../models/product";

function DisplayProduct(props) {
	return (
		<div className="col-6 col-sm-4 col-md-3 col-lg-2 p-1">
			<div className="card m-2" data-testid="card">
				{/* <img
					className="card-img-top img-fluid p-5 p-sm-2"
					src="https://m.media-amazon.com/images/I/61KB6fUhcSL._AC_SL1500_.jpg"
					alt="{props.product.productName} image"
				/> */}
				<div className="card-body">
					<h5 className="card-title" data-testid="productName">
						{props.product.productName}
					</h5>
					<p>
						<em data-testid="categoryName">
							{props.categoryName ||
								props.product.category.categoryName}
						</em>
					</p>
					<p data-testid="companyName">
						Sold by: {props.product.supplier.companyName}
					</p>
					<p data-testid="unitPrice">${props.product.unitPrice}</p>
				</div>
			</div>
		</div>
	);
}

DisplayProduct.propTypes = {
	product: PropTypes.objectOf(Product),
	categoryName: PropTypes.string,
};

export default DisplayProduct;
