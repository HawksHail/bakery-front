import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Category from "../models/category";

function CategoryRow(props) {
	return (
		<tr>
			<td>
				<Link
					className="link-primary"
					data-testid="link"
					to={{
						pathname: `/category/${props.category.id}`,
						state: { category: props.category },
					}}
				>
					{props.category.categoryName}
				</Link>
			</td>
			<td>{props.category.description}</td>
		</tr>
	);
}

CategoryRow.propTypes = {
	category: PropTypes.shape(Category),
};

export default CategoryRow;
