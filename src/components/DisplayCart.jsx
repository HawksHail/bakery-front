import React, { useContext, useEffect } from "react";
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
				<div className="row">
					<h3>Loading</h3>
				</div>
			</div>
		);
	}

	return (
		<div className="p-3">
			<h1>Cart</h1>
			<div className="row">
				{cart.length > 0 ? (
					cart.map(product => (
						<DisplayProduct product={product} key={product.id} />
					))
				) : (
					<h3>Your cart is empty</h3>
				)}
			</div>
		</div>
	);
}

export default DisplayCart;
