import React, { useContext, useEffect } from "react";
import Row from "react-bootstrap/Row";

import { getCart } from "../api/cartAPI";
import AppContext from "../contexts";
import DisplayProduct from "./DisplayProduct";

function DisplayCart() {
	const { cart, setCart } = useContext(AppContext);

	//TODO get customerID from auth
	let customerId = "test1";

	useEffect(() => {
		getCart(customerId).then(setCart).catch(console.log);
	}, []);

	if (!cart) {
		return (
			<div className="p-3">
				<h1>Cart</h1>
				<h4>Loading</h4>
			</div>
		);
	}

	return (
		<div className="p-3">
			<h1>Cart</h1>
			<Row>
				{cart.length > 0 ? (
					cart.map(product => (
						<DisplayProduct product={product} key={product.id} />
					))
				) : (
					<h4>Your cart is empty</h4>
				)}
			</Row>
		</div>
	);
}

export default DisplayCart;
