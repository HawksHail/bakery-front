import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
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
	history: PropTypes.object,
	category: PropTypes.shape(Category),
};

export default withRouter(CategoryRow);
