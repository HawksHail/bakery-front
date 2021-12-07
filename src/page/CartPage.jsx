import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useAsync } from "react-async";

import {
	getCart,
	removeFromCart,
	clearCart,
	checkoutCart,
} from "../api/cartAPI";
import AppContext, { ToastContext } from "../contexts";
import ProductCard from "../components/ProductCard";
import ProductCardRow from "../components/ProductCardRow";
import Loading from "../components/Loading";

function CartPage() {
	const { cart, setCart, customer } = useContext(AppContext);
	const { handleAddToast } = useContext(ToastContext);
	const { getAccessTokenSilently } = useAuth0();

	const {
		error,
		counter,
		run: runGetCart,
	} = useAsync({
		deferFn: getCart,
		onResolve: setCart,
		onReject: console.error,
	});

	const handleRemoveButton = async item => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await removeFromCart(
				customer.id,
				item.product.id,
				accessToken
			).then(setCart);
			handleAddToast(
				"Item removed!",
				`${item.product.productName} removed from cart!`,
				"danger",
				"text-white"
			);
		} catch (error) {
			console.error("Error removing item", error);
		}
	};

	const handleClearButton = async () => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await clearCart(customer.id, accessToken);
			window.scrollTo(0, 0);
			setCart([]);
			handleAddToast("Cleared!", "Cart cleared!", "danger", "text-white");
		} catch (error) {
			console.error("Error clearing cart", error);
		}
	};

	const handleCheckoutButton = async () => {
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			await checkoutCart(customer.id, accessToken);
			window.scrollTo(0, 0);
			setCart([]);
			handleAddToast("Success!", "Checked out!", "primary", "text-white");
		} catch (error) {
			console.error("Error checking out", error);
		}
	};

	async function getTokenAndRunGetCart() {
		const token = await getAccessTokenSilently({
			audience: "https://zion.ee-cognizantacademy.com",
		});
		runGetCart(customer.id, token);
	}

	if (customer?.id && counter == 0) {
		getTokenAndRunGetCart();
	}

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

	if (!cart) {
		return (
			<>
				<h1>Cart</h1>
				<h4>
					<Loading />
				</h4>
			</>
		);
	}

	return (
		<>
			<h1>Cart</h1>
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
								buttonClick={() => handleRemoveButton(item)}
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
							{cart
								.reduce(
									(prev, curr) =>
										prev +
										curr.quantity * curr.product.unitPrice,
									0
								)
								.toLocaleString(undefined, {
									minimumFractionDigits: 2,
								})}
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default CartPage;
