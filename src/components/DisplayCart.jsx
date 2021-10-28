import React, { useContext, useEffect } from "react";
import Row from "react-bootstrap/Row";

import { getCart, removeFromCart } from "../api/cartAPI";
import AppContext from "../contexts";
import DisplayProduct from "./DisplayProduct";

function DisplayCart() {
	const { cart, setCart } = useContext(AppContext);

	//TODO get customerID from auth
	let customerId = "test1";

	useEffect(() => {
		getCart(customerId).then(setCart).catch(console.log);
	}, [customerId]);

	const removeFromCartButton = prodId => {
		removeFromCart(customerId, prodId).then(setCart);
	};

	if (!cart.items) {
		return (
			<div className="p-3">
				<h1>Cart</h1>
				<h4>Loading</h4>
			</div>
		);
	}

	if (cart.items.length < 1) {
		return (
			<div className="p-3">
				<h1>Cart</h1>
				<h4>Your cart is empty</h4>
			</div>
		);
	}

	//todo add cart quantity
	return (
		<div className="p-3">
			<h1>Cart</h1>
			<Row>
				{cart.items.map(item => (
					<DisplayProduct
						product={item.product}
						key={item.product.id}
						buttonText="Remove"
						buttonClick={removeFromCartButton}
					/>
				))}
			</Row>
		</div>
	);
}

export default DisplayCart;
