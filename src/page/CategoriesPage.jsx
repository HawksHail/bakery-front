import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import { useAsync } from "react-async";

import { ProductContext } from "../contexts";
import { getAllCategories } from "../api/categoryAPI";
import CategoryRow from "../components/CategoryRow";
import Loading from "../components/Loading";

function CategoriesPage() {
	const { categories, setCategories } = useContext(ProductContext);

	const { error } = useAsync({
		promiseFn: getAllCategories,
		onResolve: setCategories,
		onReject: console.error,
		initialValue: !categories || categories?.length < 1 ? null : categories,
	});

	if (error) {
		return (
			<>
				<h2 className="text-danger">Error</h2>

				<p>
					HTTP {error.cause}: {error.message}
				</p>
			</>
		);
	}

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
