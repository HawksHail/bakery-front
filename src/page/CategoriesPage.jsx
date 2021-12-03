import React, { useContext, useEffect } from "react";
import { Table } from "react-bootstrap";

import { ProductContext } from "../contexts";
import { getAllCategories } from "../api/categoryAPI";
import CategoryRow from "../components/CategoryRow";
import Loading from "../components/Loading";

function CategoriesPage() {
	const { categories, setCategories } = useContext(ProductContext);

	useEffect(() => {
		if (!categories || categories?.length < 1) {
			getAllCategories().then(setCategories).catch(console.log);
		}
	}, []);

	return (
		<>
			<h1>Categories</h1>
			<Table striped hover bordered>
				<thead>
					<tr>
						<th>Category Name</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{categories.length > 0 ? (
						categories.map(category => (
							<CategoryRow
								category={category}
								key={category.id}
							/>
						))
					) : (
						<tr>
							<td colSpan="2">
								<Loading />
							</td>
						</tr>
					)}
				</tbody>
			</Table>
		</>
	);
}

export default CategoriesPage;
