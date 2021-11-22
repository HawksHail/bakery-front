import React, { useContext, useState, useEffect } from "react";
import { Form, Button, FloatingLabel } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

import { updateCustomer } from "../api/customerAPI";
import AppContext from "../contexts";
import Loading from "./Loading";

function Profile() {
	const { customer } = useContext(AppContext);
	const { getAccessTokenSilently } = useAuth0();

	const [name, setName] = useState("");
	const [company, setCompany] = useState("");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");

	useEffect(() => {
		if (customer) {
			setName(customer.contactName ? customer.contactName : "");
			setCompany(customer.companyName ? customer.companyName : "");
			setStreet(customer.street ? customer.street : "");
			setCity(customer.city ? customer.city : "");
			setState(customer.state ? customer.state : "");
		}
	}, [customer]);

	const handleSave = async event => {
		event.preventDefault();
		const newCustomer = {
			customerId: customer.customerId,
			sub: customer.sub,
			contactName: name,
			companyName: company,
			street,
			city,
			state,
		};
		console.log(`newCustomer`, newCustomer);
		try {
			const accessToken = await getAccessTokenSilently({
				audience: "https://zion.ee-cognizantacademy.com",
			});
			updateCustomer(newCustomer, accessToken);
		} catch (error) {
			console.log("save customer", error);
		}
	};

	if (!customer)
		return (
			<>
				<h1>Profile</h1>
				<h4>
					<Loading />
				</h4>
			</>
		);

	return (
		<>
			<h1>Profile</h1>
			<Form onSubmit={handleSave}>
				<FloatingLabel className="mb-3" label="Name">
					<Form.Control
						type="text"
						placeholder="Name"
						value={name}
						onChange={e => {
							setName(e.target.value);
						}}
						aria-label="Name"
					/>
				</FloatingLabel>
				<FloatingLabel className="mb-3" label="Company">
					<Form.Control
						type="text"
						placeholder="Company"
						value={company}
						onChange={e => {
							setCompany(e.target.value);
						}}
						aria-label="Company"
					/>
				</FloatingLabel>
				<FloatingLabel className="mb-3" label="Street">
					<Form.Control
						type="text"
						placeholder="Street"
						value={street}
						onChange={e => {
							setStreet(e.target.value);
						}}
						aria-label="Street"
					/>
				</FloatingLabel>
				<FloatingLabel className="mb-3" label="City">
					<Form.Control
						type="text"
						placeholder="City"
						value={city}
						onChange={e => {
							setCity(e.target.value);
						}}
						aria-label="City"
					/>
				</FloatingLabel>
				<FloatingLabel className="mb-3" label="State">
					<Form.Control
						type="text"
						placeholder="State"
						value={state}
						onChange={e => {
							setState(e.target.value);
						}}
						aria-label="State"
					/>
				</FloatingLabel>
				<Button
					type="submit"
					disabled={
						(name === customer.contactName || name === "") &&
						company === customer.companyName &&
						(street === customer.street || street === "") &&
						(city === customer.city || city === "") &&
						(state === customer.state || state === "")
					}
				>
					Save
				</Button>
			</Form>
		</>
	);
}

export default Profile;
