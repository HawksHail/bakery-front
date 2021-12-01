import React from "react";
import { ToastContainer, Toast, ToastHeader, ToastBody } from "react-bootstrap";

import useToasts from "../hooks/useToasts";

function DisplayToasts() {
	const { toasts, setToasts } = useToasts();

	return (
		<ToastContainer className="fixed-bottom m-2">
			{toasts.map((x, idx) => (
				<Toast
					key={x.id}
					onClose={() => {
						const arr = [...toasts];
						arr[idx].show = false;
						setToasts(arr);
					}}
					show={x.show}
					delay={4500}
					autohide
				>
					<ToastHeader>
						<strong className="me-auto">{x.header}</strong>
					</ToastHeader>
					<ToastBody>{x.body}</ToastBody>
				</Toast>
			))}
		</ToastContainer>
	);
}

export default DisplayToasts;
