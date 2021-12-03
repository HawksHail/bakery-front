import React from "react";
import ReactDOM from "react-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import "./scss/custom.scss";

import "./styles/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import AppContextProvider from "./contexts/AppContextProvider";
import ToastContextProvider from "./contexts/ToastContextProvider";
import ProductContextProvider from "./contexts/ProductContextProvider";

ReactDOM.render(
	<Auth0Provider
		domain="dev-1en1mmfn.us.auth0.com"
		clientId="EL35E8d1cWm7zpI61PhIG8ubgsj8xx6O"
		redirectUri={window.location.origin}
		audience="https://zion.ee-cognizantacademy.com"
	>
		<React.StrictMode>
			<AppContextProvider>
				<ToastContextProvider>
					<ProductContextProvider>
						<App />
					</ProductContextProvider>
				</ToastContextProvider>
			</AppContextProvider>
		</React.StrictMode>
	</Auth0Provider>,
	document.getElementById("root")
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
