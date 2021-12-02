import React, { useEffect, useState, useContext } from "react";
import { Table } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import { getOrders } from "../api/orderAPI";
import AppContext from "../contexts";
import Loading from "../components/Loading";

function OrderPage() {
	const [orders, setOrders] = useState(null);
	const { getAccessTokenSilently } = useAuth0();
	const { customer } = useContext(AppContext);

	useEffect(() => {
		const abortController = new AbortController();
		async function fetchOrders() {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			getOrders(customer.id, accessToken, abortController)
				.then(setOrders)
				.catch(console.log);
		}
		if (customer?.id) {
			fetchOrders();
		}
		return () => {
			abortController.abort(); // cancel pending fetch request on component unmount
		};
	}, [customer?.id, getAccessTokenSilently]);

	return (
		<>
			<h1>Orders</h1>
			{orders ? (
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Order Number</th>
							<th>Date</th>
							<th>Status</th>
							<th>Total</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>
						{orders.length > 0 ? (
							orders.map(order => (
								<tr key={order.id}>
									<td>
										<Link
											to={{
												pathname: `/orders/${order.id}`,
												state: { order },
											}}
										>
											#{order.id}
										</Link>
									</td>
									<td>{order.orderDate}</td>
									<td>Pending</td>
									<td>
										$
										{order.detailsList
											.reduce(
												(prev, curr) =>
													prev +
													curr.product.unitPrice *
														curr.quantity,
												0
											)
											.toLocaleString(undefined, {
												minimumFractionDigits: 2,
											})}
									</td>
									<td>
										<Link
											to={{
												pathname: `/orders/${order.id}`,
												state: { order },
											}}
										>
											View
										</Link>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="5">No orders</td>
							</tr>
						)}
					</tbody>
				</Table>
			) : (
				<h6>
					<Loading />
				</h6>
			)}
		</>
	);
}

export default OrderPage;
