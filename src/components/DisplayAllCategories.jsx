import React, { useContext, useEffect } from "react";
import AppContext from "../contexts";
import { getAllCategories } from "../api/categoryAPI";
import DisplayCategory from "./DisplayCategory";

function DisplayAllCategories() {
	const { categories, setCategories } = useContext(AppContext);

	useEffect(() => {
		getAllCategories().then(setCategories).catch(console.log);
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
				{categories.length > 0 ? (
					categories.map(category => (
						<DisplayCategory
							category={category}
							key={category.id}
						/>
					))
				) : (
					<tr>
						<td colSpan="2">Loading</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default DisplayAllCategories;