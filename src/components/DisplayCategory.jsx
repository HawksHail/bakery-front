import React from "react";
import PropTypes from "prop-types";
import Category from "../models/category";

function DisplayCategory(props) {
	return (
		<tr>
			<td>{props.category.categoryName}</td>
			<td>{props.category.description}</td>
		</tr>
	);
}

DisplayCategory.propTypes = {
	category: PropTypes.objectOf(Category),
};

export default DisplayCategory;
