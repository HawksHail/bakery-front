import React, { useContext, useEffect } from "react";
import {Row} from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

import { getCart, removeFromCart } from "../api/cartAPI";
import AppContext from "../contexts";
import DisplayProduct from "./DisplayProduct";

function DisplayCart() {
	const { cart, setCart, customer } = useContext(AppContext);
	const { getAccessTokenSilently } = useAuth0();

	useEffect(async () => {
		if (customer?.customerId) {
			try {
				const accessToken = await getAccessTokenSilently({
					audience: "https://zion.ee-cognizantacademy.com",
				});

				getCart(customer.customerId, accessToken)
					.then(setCart)
					.catch(console.log);
			} catch (error) {
				console.log(error);
			}
		}
	}, [customer?.customerId, getAccessTokenSilently]);

	const removeFromCartButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			removeFromCart(customer.customerId, prodId, accessToken).then(
				setCart
			);
		} catch (error) {
			console.log(error);
		}
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
						quantity={item.quantity}
					/>
				))}
			</Row>
		</div>
	);
}

export default DisplayCart;
