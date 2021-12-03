import React, { useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import AppContext, { ProductContext, ToastContext } from "../contexts";
import { getAllProducts } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import ProductCardRow from "../components/ProductCardRow";

function ProductsPage({ history }) {
	const { setCart, customer } = useContext(AppContext);
	const { products, setProducts } = useContext(ProductContext);
	const { handleAddToast } = useContext(ToastContext);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		if (!products || products?.length < 1) {
			getAllProducts().then(setProducts).catch(console.log);
		}
	}, []);

	const addToCartButton = async product => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await addToCart(customer.id, product.id, accessToken).then(setCart);
			handleAddToast(
				"Success",
				`${product.productName} added to cart!`,
				"primary",
				"text-white"
			);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<h1>All Products</h1>
			<ProductCardRow>
				{products.length > 0 ? (
					products.map(product => (
						<ProductCard
							product={product}
							key={product.id}
							buttonText="Add to Cart"
							buttonClick={
								isAuthenticated
									? () => addToCartButton(product)
									: () => {
											history.push("/login");
									  }
							}
						/>
					))
				) : (
					<h3 colSpan="4">
						<Loading />
					</h3>
				)}
			</ProductCardRow>
		</>
	);
}

ProductsPage.propTypes = {
	history: PropTypes.object,
};

export default withRouter(ProductsPage);
