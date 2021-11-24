import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import Category from "../models/category";

function CategoryRow(props) {
	return (
		<tr>
			<td>
				<a
					className="link-primary"
					data-testid="link"
					style={{ cursor: "pointer" }}
					onClick={() =>
						props.history.push(`/category/${props.category.id}`)
					}
				>
					{props.category.categoryName}
				</a>
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
