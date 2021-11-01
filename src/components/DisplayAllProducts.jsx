import React, { useContext, useEffect } from "react";
import Row from "react-bootstrap/Row";
import { useAuth0 } from "@auth0/auth0-react";

import AppContext from "../contexts";
import { getAllProducts } from "../api/productAPI";
import { addToCart } from "../api/cartAPI";
import DisplayProduct from "./DisplayProduct";

function DisplayAllProducts() {
	const { products, setProducts, setCart } = useContext(AppContext);
	const { getAccessTokenSilently } = useAuth0();

	useEffect(() => {
		getAllProducts().then(setProducts).catch(console.log);
	}, []);

	//todo get custId from auth
	const custId = 90;

	const addToCartButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			addToCart(custId, prodId, accessToken).then(setCart);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Row className="p-1">
			{products.length > 0 ? (
				products.map(product => (
					<DisplayProduct
						product={product}
						key={product.id}
						buttonText="Add to Cart"
						buttonClick={addToCartButton}
					/>
				))
			) : (
				<h3 colSpan="4">Loading</h3>
			)}
		</Row>
	);
}

export default DisplayAllProducts;
