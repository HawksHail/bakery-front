import React, { useContext } from "react";
import { ToastContainer, Toast, ToastHeader, ToastBody } from "react-bootstrap";

import { ToastContext } from "../contexts";

function DisplayToasts() {
	const { toasts, setToasts } = useContext(ToastContext);

	return (
		<ToastContainer className="fixed-bottom m-2">
			{toasts.map((toast, idx) => (
				<Toast
					key={toast.id}
					bg={toast.variant}
					onClose={() => {
						const arr = [...toasts];
						arr[idx].show = false;
						setToasts(arr);
					}}
					show={toast.show}
					delay={4500}
					autohide
				>
					<ToastHeader>
						<strong className="me-auto">{toast.header}</strong>
					</ToastHeader>
					<ToastBody
						className={
							(toast.variant === "primary" ||
								toast.variant === "dark" ||
								toast.variant === "info") &&
							"text-white"
						}
					>
						{toast.body}
					</ToastBody>
				</Toast>
			))}
		</ToastContainer>
	);
}

export default DisplayToasts;
