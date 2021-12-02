import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, withRouter } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { Table } from "react-bootstrap";

import { getOrder } from "../api/orderAPI";
import Loading from "../components/Loading";

function OrderDetailsPage(props) {
	const { id } = useParams();
	const { getAccessTokenSilently } = useAuth0();
	const [order, setOrder] = useState(props.location?.state?.order);

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
		if (!order) {
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
					<Table striped bordered hover>
						<thead>
							<tr>
								<th>Product</th>
								<th>Quantity</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{order.detailsList.map(item => (
								<tr key={item.product.id}>
									<td>{item.product.productName}</td>
									<td>{item.quantity}</td>
									<td>
										$
										{(
											item.quantity *
											item.product.unitPrice
										).toLocaleString(undefined, {
											minimumFractionDigits: 2,
										})}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<th colSpan="2" className="text-end">
									Total
								</th>
								<td>
									$
									{order.detailsList
										.reduce(
											(prev, curr) =>
												prev +
												curr.quantity *
													curr.product.unitPrice,
											0
										)
										.toLocaleString(undefined, {
											minimumFractionDigits: 2,
										})}
								</td>
							</tr>
						</tfoot>
					</Table>
				</div>
			) : (
				<h4>
					<Loading />
				</h4>
			)}
		</>
	);
}

OrderDetailsPage.propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string,
		state: PropTypes.shape({
			order: PropTypes.shape({
				id: PropTypes.number,
				customer: PropTypes.shape({ id: PropTypes.number }),
				orderDate: PropTypes.string,
				detailsList: PropTypes.array,
			}),
		}),
	}),
};

export default withRouter(OrderDetailsPage);
