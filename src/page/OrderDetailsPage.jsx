/* eslint-disable no-unused-vars */ //todo remove
import React, { useState, useEffect } from "react";
import { useParams, withRouter } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import { getOrder } from "../api/orderAPI";
import Loading from "../components/Loading";

function OrderDetailsPage() {
	const { id } = useParams();
	const { getAccessTokenSilently } = useAuth0();
	const [order, setOrder] = useState(null);

	useEffect(() => {
		const abortController = new AbortController();
		async function fetchOrder() {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			getOrder(id, accessToken, abortController)
				.then(setOrder)
				.catch(console.log);
		}
		if (id) {
			fetchOrder();
		}
		return () => {
			abortController.abort(); // cancel pending fetch request on component unmount
		};
	}, [id, getAccessTokenSilently]);

	return (
		<>
			<h1>Order #{id}</h1>
			{order ? (
				<div>
					<p>
						Order{" "}
						<span className="text-primary fw-bold">
							#{order.id}
						</span>{" "}
						was placed on{" "}
						<span className="text-primary fw-bold">
							{order.orderDate}
						</span>{" "}
						and is currently{" "}
						<span className="text-primary fw-bold">Processing</span>
						.
					</p>
				</div>
			) : (
				<h4>
					<Loading />
				</h4>
			)}
		</>
	);
}

export default withRouter(OrderDetailsPage);
/* eslint-enable no-unused-vars */ //todo remove
