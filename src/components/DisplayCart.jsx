import React, { useContext, useEffect, useState } from "react";
import { Row, Alert, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

import { getCart, removeFromCart, clearCart } from "../api/cartAPI";
import AppContext from "../contexts";
import DisplayProduct from "./DisplayProduct";

function DisplayCart() {
	const { cart, setCart, customer } = useContext(AppContext);
	const { getAccessTokenSilently } = useAuth0();
	const [showAlert, setShowAlert] = useState(false);

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

	useEffect(() => {
		let interval = null;
		if (showAlert) {
			interval = setInterval(() => {
				setShowAlert(false);
			}, 4500);
		} else if (!showAlert) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [showAlert]);

	const removeFromCartButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await removeFromCart(customer.customerId, prodId, accessToken).then(
				setCart
			);
			setShowAlert(true);
		} catch (error) {
			console.log(error);
		}
	};

	const clearCartButton = async () => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await clearCart(customer.customerId, accessToken);
			setCart([]);
			setShowAlert(true);
		} catch (error) {
			console.log(error);
		}
	};

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
			<Alert
				className="fixed-bottom m-3 w-25"
				show={showAlert}
				variant="danger"
				transition
				dismissible
				onClose={() => setShowAlert(false)}
			>
				<Alert.Heading>Item removed!</Alert.Heading>
			</Alert>
			{cart.length < 1 ? (
				<h4>Your cart is empty</h4>
			) : (
				<div>
					<Row>
						{cart.map(item => (
							<DisplayProduct
								product={item.product}
								key={item.product.id}
								buttonText="Remove"
								buttonClick={removeFromCartButton}
								quantity={item.quantity}
							/>
						))}
					</Row>
					<div className="vstack gap-1">
						<div>
							<Button
								variant="danger"
								className="mt-3"
								onClick={clearCartButton}
							>
								Clear cart
							</Button>
						</div>
						<div>
							Total: $
							{cart.reduce(
								(prev, curr) =>
									prev +
									curr.quantity * curr.product.unitPrice,
								0
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default DisplayCart;
