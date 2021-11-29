/* eslint-disable no-unused-vars */ //todo remove
import React from "react";
import { useParams, withRouter } from "react-router";

function OrderDetailsPage() {
	const { id } = useParams();

	console.log(`id`, id);

	return <h1>Order #{id}</h1>;
}

export default withRouter(OrderDetailsPage);
/* eslint-enable no-unused-vars */ //todo remove
