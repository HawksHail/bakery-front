import React from "react";
import { Link } from "react-router-dom";

function Category(props) {
	return (
		// TODO display products in category
		<tr>
			{/* <Link to={`/category/${props.category.categoryName.toLowerCase()}`}> */}
			<td>{props.category.categoryName}</td>
			{/* </Link> */}
			<td>{props.category.description}</td>
		</tr>
	);
}

export default Category;
