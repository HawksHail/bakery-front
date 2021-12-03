import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, withRouter } from "react-router";
import { Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { Breadcrumb } from "react-bootstrap";

import AppContext, { ToastContext } from "../contexts";
import { getCategory } from "../api/categoryAPI";
import { addToCart } from "../api/cartAPI";
import ProductCard from "../components/ProductCard";
import ProductCardRow from "../components/ProductCardRow";
import Loading from "../components/Loading";
import Category from "../models/category";

function CategoryPage(props) {
	const { id } = useParams();
	const [category, setCategory] = useState(props.location?.state?.category);
	const { setCart, customer } = useContext(AppContext);
	const { handleAddToast } = useContext(ToastContext);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const history = useHistory();

	useEffect(() => {
		if (!category?.productList) {
			getCategory(id).then(setCategory).catch(console.log);
		}
	}, [id]);

	const addToCartButton = async product => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await addToCart(customer.id, product.id, accessToken)
				.then(setCart)
				.catch(e => console.log("Error posting cart", e));
			handleAddToast(
				"Success",
				`${product.productName} added to cart!`,
				"primary",
				"text-white"
			);
		} catch (error) {
			console.log("Error adding to cart", error);
		}
	};

	if (!category) {
		return (
			<div>
				<Loading />
			</div>
		);
	}

	return (
		<>
			<h1>{category.categoryName}</h1>
			<Breadcrumb>
				<Breadcrumb.Item linkAs={Link} linkProps={{ to: "/category" }}>
					Category
				</Breadcrumb.Item>
				<Breadcrumb.Item active>
					{category.categoryName}
				</Breadcrumb.Item>
			</Breadcrumb>
			{category?.productList ? (
				<ProductCardRow>
					{category.productList.map(product => (
						<ProductCard
							product={product}
							key={product.id}
							categoryName={category.categoryName}
							buttonText="Add to Cart"
							buttonClick={
								isAuthenticated
									? () => addToCartButton(product)
									: () => {
											history.push("/login");
									  }
							}
						/>
					))}
				</ProductCardRow>
			) : (
				<Loading />
			)}
		</>
	);
}

CategoryPage.propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string,
		state: PropTypes.shape({
			category: PropTypes.shape(Category),
		}),
	}),
};

export default withRouter(CategoryPage);
