import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCategory } from "../api/categoryAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayCategoryItems() {
	const { id } = useParams();
	const [category, setCategory] = useState(null);

	useEffect(() => {
		getCategory(id).then(setCategory).catch(console.log);
	}, [id]);

	if (!category) {
		return <div>Loading</div>;
	}

	return (
		<div className="row p-3">
			{category.productList.map(product => (
				<DisplayProduct
					product={product}
					key={product.id}
					categoryName={category.categoryName}
				/>
			))}
		</div>
	);
}

export default DisplayCategoryItems;
