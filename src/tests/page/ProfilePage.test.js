import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import nock from "nock";
import { useAuth0 } from "@auth0/auth0-react";

import ProfilePage from "../../page/ProfilePage";
import AppContext from "../../contexts";
import { url } from "../../api/url";

jest.mock("@auth0/auth0-react");

const fakeCustomer = {
	id: 9,
	sub: "auth0|ID",
	companyName: "test company",
	contactName: "test name",
	street: "test street",
	city: "test city",
	state: "test state",
	cart: [],
};

const setForm = (name, company, street, city, state) => {
	const nameInput = screen.getByRole("textbox", { name: "Name" });
	const companyInput = screen.getByRole("textbox", { name: "Company" });
	const streetInput = screen.getByRole("textbox", { name: "Street" });
	const cityInput = screen.getByRole("textbox", { name: "City" });
	const stateInput = screen.getByRole("textbox", { name: "State" });

	userEvent.clear(nameInput);
	userEvent.type(nameInput, name);

	userEvent.clear(companyInput);
	userEvent.type(companyInput, company);

	userEvent.clear(streetInput);
	userEvent.type(streetInput, street);

	userEvent.clear(cityInput);
	userEvent.type(cityInput, city);

	userEvent.clear(stateInput);
	userEvent.type(stateInput, state);
};

beforeEach(() => {
	nock.restore();
	useAuth0.mockReturnValue({
		isAuthenticated: true,
		getAccessTokenSilently: jest.fn().mockReturnValue("token"),
	});
});

afterEach(function () {
	if (!nock.isDone()) {
		console.log(`nock.pendingMocks()`, nock.pendingMocks());
		nock.cleanAll();
		throw new Error("Not all nock interceptors were used!");
	}
});

test("Display loading before customer is loaded", () => {
	render(<ProfilePage />);

	expect(screen.getByText("Loading")).toBeInTheDocument();
});

test("profile form renders", () => {
	render(
		<AppContext.Provider value={{ customer: fakeCustomer }}>
			<ProfilePage />
		</AppContext.Provider>
	);

	expect(screen.getByText("Profile")).toBeInTheDocument();

	expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
	expect(
		screen.getByRole("textbox", { name: "Company" })
	).toBeInTheDocument();
	expect(screen.getByRole("textbox", { name: "Street" })).toBeInTheDocument();
	expect(screen.getByRole("textbox", { name: "City" })).toBeInTheDocument();
	expect(screen.getByRole("textbox", { name: "State" })).toBeInTheDocument();
});

test("profile loads customer info", () => {
	render(
		<AppContext.Provider value={{ customer: fakeCustomer }}>
			<ProfilePage />
		</AppContext.Provider>
	);

	expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
		"test name"
	);
	expect(screen.getByRole("textbox", { name: "Company" })).toHaveValue(
		"test company"
	);
	expect(screen.getByRole("textbox", { name: "Street" })).toHaveValue(
		"test street"
	);
	expect(screen.getByRole("textbox", { name: "City" })).toHaveValue(
		"test city"
	);
	expect(screen.getByRole("textbox", { name: "State" })).toHaveValue(
		"test state"
	);
});

test("typing updates value", () => {
	render(
		<AppContext.Provider value={{ customer: fakeCustomer }}>
			<ProfilePage />
		</AppContext.Provider>
	);

	setForm("John", "Cognizant", "1st Lane", "New York City", "New York");

	const nameInput = screen.getByRole("textbox", { name: "Name" });
	const companyInput = screen.getByRole("textbox", { name: "Company" });
	const streetInput = screen.getByRole("textbox", { name: "Street" });
	const cityInput = screen.getByRole("textbox", { name: "City" });
	const stateInput = screen.getByRole("textbox", { name: "State" });

	expect(nameInput).toHaveValue("John");
	expect(companyInput).toHaveValue("Cognizant");
	expect(streetInput).toHaveValue("1st Lane");
	expect(cityInput).toHaveValue("New York City");
	expect(stateInput).toHaveValue("New York");
});

test("Save button disabled if nothing new", () => {
	render(
		<AppContext.Provider value={{ customer: fakeCustomer }}>
			<ProfilePage />
		</AppContext.Provider>
	);

	expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
});

test("Save button enabled if new info entered", () => {
	render(
		<AppContext.Provider value={{ customer: fakeCustomer }}>
			<ProfilePage />
		</AppContext.Provider>
	);

	const saveButton = screen.getByRole("button", { name: "Save" });

	setForm("John");
	expect(saveButton).toBeEnabled();

	setForm(null, "Cognizant");
	expect(saveButton).toBeEnabled();

	setForm(null, null, "1st Lane");
	expect(saveButton).toBeEnabled();

	setForm(null, null, null, "New York City");
	expect(saveButton).toBeEnabled();

	setForm(null, null, null, null, "New York");
	expect(saveButton).toBeEnabled();
});

test("save button PUTs", async () => {
	nock.activate();
	const scope = nock(url)
		.defaultReplyHeaders({
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Authorization",
		})
		.options("/customer")
		.optionally()
		.reply(200)
		.options(`/customer/${fakeCustomer.id}`)
		.optionally()
		.reply(200)
		.get(`/customer/${fakeCustomer.id}`)
		.optionally()
		.reply(200, fakeCustomer)
		.put("/customer")
		.once()
		.reply(204);

	const setCustomer = jest.fn();

	render(
		<AppContext.Provider value={{ customer: fakeCustomer, setCustomer }}>
			<ProfilePage />
		</AppContext.Provider>
	);

	setForm("John", "Cognizant", "1st Lane", "New York City", "New York");

	const saveButton = screen.getByRole("button", { name: "Save" });

	userEvent.click(saveButton);

	await waitFor(() => {
		expect(scope.isDone()).toBeTruthy();
	});

	await waitFor(() => {
		expect(setCustomer).toBeCalledTimes(2);
	});
});
