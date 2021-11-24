/* eslint-disable no-unused-vars */ //todo remove
import React from "react";
import { Table } from "react-bootstrap";

function OrderPage() {
	return (
		<>
			<h1>Orders</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Order Number</th>
						<th>Order Date</th>
						<th>Number of Items</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Lorem, ipsum.</td>
						<td>Lorem, ipsum dolor.</td>
						<td>Lorem.</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
}

export default OrderPage;
/* eslint-enable no-unused-vars */ //todo remove
