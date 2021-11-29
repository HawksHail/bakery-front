import React from "react";
import { render, screen } from "@testing-library/react";
import nock from "nock";
import { Route } from "react-router-dom";
import { MemoryRouter } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import OrderDetailsPage from "../../page/OrderDetailsPage";
import { url } from "../../api/url";

jest.mock("@auth0/auth0-react");

const user = {
	email: "johndoe@me.com",
	email_verified: true,
	sub: "google-oauth2|2147627834623744883746",
};

afterEach(function () {
	if (!nock.isDone()) {
		console.log(`nock.pendingMocks()`, nock.pendingMocks());
		nock.cleanAll();
		throw new Error("Not all nock interceptors were used!");
	}
});

beforeEach(() => {
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		user,
		logout: jest.fn(),
		loginWithRedirect: jest.fn(),
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

test("API call not loaded yet", () => {
	nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
		})
		.get("/order/1")
		.optionally()
		.reply(200);

	render(
		<MemoryRouter initialEntries={["/orders/1"]}>
			<Route path="/orders/:id">
				<OrderDetailsPage />
			</Route>
		</MemoryRouter>
	);

	expect(screen.getByText(/order\s*#1/i)).toBeInTheDocument();
});
