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
	}, [customerId]);

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

	return (
		<div className="p-3">
			<h1>Cart</h1>
			<Row>
				{cart.items.map(item => (
					<DisplayProduct
						product={item.product}
						key={item.product.id}
					/>
				))}
			</Row>
		</div>
	);
}

export default DisplayCart;
