import React, { useContext, useEffect } from "react";
import AppContext from "../contexts";
import { getAllCategories } from "../api/categoryAPI";
import Category from "./Category";

function DisplayCategories() {
	const { categories, setCategories } = useContext(AppContext);

	useEffect(() => {
		getAllCategories()
			.then(categories => setCategories(categories))
			.catch(error => console.log(error));
	}, [categories, setCategories]);

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
					<Category category={category} key={category.categoryId} />
				))}
			</tbody>
		</table>
	);
}

export default DisplayCategories;
