import React, { useContext, useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

import {
	getCart,
	removeFromCart,
	clearCart,
	checkoutCart,
} from "../api/cartAPI";
import AppContext from "../contexts";
import ProductCard from "./ProductCard";
import ProductCardRow from "./ProductCardRow";
import Loading from "./Loading";

function DisplayCart() {
	const { cart, setCart, customer } = useContext(AppContext);
	const { getAccessTokenSilently } = useAuth0();
	const [showAlert, setShowAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

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
				console.log("Error updating customer", error);
			}
		}
	}, [customer?.customerId, getAccessTokenSilently]);

	useEffect(() => {
		let interval = null;
		if (showAlert) {
			interval = setInterval(() => {
				setShowAlert(false);
			}, 4500);
		} else {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [showAlert]);

	const handleRemoveButton = async prodId => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await removeFromCart(customer.customerId, prodId, accessToken).then(
				setCart
			);
			setAlertMessage("Item removed!");
			setShowAlert(true);
		} catch (error) {
			console.log("Error removing item", error);
		}
	};

	const handleClearButton = async () => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await clearCart(customer.customerId, accessToken);
			window.scrollTo(0, 0);
			setCart([]);
			setAlertMessage("Cart cleared!");
			setShowAlert(true);
		} catch (error) {
			console.log("Error clearing cart", error);
		}
	};

	const handleCheckoutButton = async () => {
		alert("handleCheckoutButton ");
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await checkoutCart(customer.customerId, accessToken);
			window.scrollTo(0, 0);
			setCart([]);
			setAlertMessage("Checked out successfully!");
			setShowAlert(true);
		} catch (error) {
			console.log("Error checking out", error);
		}
	};

	if (!cart) {
		return (
			<>
				<h1>Cart</h1>
				<Alert
					className="fixed-bottom"
					show={showAlert}
					variant="danger"
					transition
					dismissible
					onClose={() => setShowAlert(false)}
				>
					<Alert.Heading>{alertMessage}</Alert.Heading>
				</Alert>
				<h4>
					<Loading />
				</h4>
			</>
		);
	}

	return (
		<>
			<h1>Cart</h1>
			<Alert
				className="fixed-bottom"
				show={showAlert}
				variant="danger"
				transition
				dismissible
				onClose={() => setShowAlert(false)}
			>
				<Alert.Heading>{alertMessage}</Alert.Heading>
			</Alert>
			{cart.length < 1 ? (
				<h4>Your cart is empty</h4>
			) : (
				<div>
					<ProductCardRow>
						{cart.map(item => (
							<ProductCard
								product={item.product}
								key={item.product.id}
								buttonText="Remove"
								buttonClick={handleRemoveButton}
								quantity={item.quantity}
							/>
						))}
					</ProductCardRow>
					<div className="vstack gap-3 mt-3">
						<div className="hstack gap-3">
							<Button
								variant="danger"
								onClick={handleClearButton}
							>
								Clear cart
							</Button>
							<Button
								variant="primary"
								onClick={handleCheckoutButton}
							>
								Checkout
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
		</>
	);
}

export default DisplayCart;
