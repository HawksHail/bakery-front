import React, { useContext, useEffect } from "react";
import AppContext from "../contexts";
import { getAllCategories } from "../api/categoryAPI";
import DisplayCategory from "./DisplayCategory";

function DisplayAllCategories() {
	const { categories, setCategories } = useContext(AppContext);

	useEffect(() => {
		getAllCategories()
			.then(categories => setCategories(categories))
			.catch(error => console.log(error));
	}, []);

	return (
		<table className="table table-striped">
			<thead>
				<tr>
					<th>Category Name</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{categories.map(category => (
					<DisplayCategory
						category={category}
						key={category.categoryId}
					/>
				))}
			</tbody>
		</table>
	);
}

export default DisplayAllCategories;
