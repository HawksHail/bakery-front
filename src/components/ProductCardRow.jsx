import React from "react";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";

function ProductCardRow({ children }) {
	return (
		<Row xs={1} sm={2} md={3} xl={4} xxl={5} className="g-2">
			{children}
		</Row>
	);
}

ProductCardRow.propTypes = {
	children: PropTypes.node,
};

export default ProductCardRow;
