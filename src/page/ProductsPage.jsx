import React, { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";
import { useAsync } from "react-async";

import AppContext, { ProductContext, ToastContext } from "../contexts";
import { getAllProducts } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import Loading from "../components/Loading";
import ProductCard from "../components/ProductCard";
import ProductCardRow from "../components/ProductCardRow";

function ProductsPage() {
	const { setCart, customer } = useContext(AppContext);
	const { products, setProducts } = useContext(ProductContext);
	const { handleAddToast } = useContext(ToastContext);
	const { isAuthenticated, getAccessTokenSilently } = useAuth0();
	const history = useHistory();

	const { error } = useAsync({
		promiseFn: getAllProducts,
		onResolve: setProducts,
		onReject: console.error,
		initialValue: !products || products?.length < 1 ? null : products,
	});

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
			console.error("Error adding to cart", error);
		}
	};

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

export default ProductsPage;
