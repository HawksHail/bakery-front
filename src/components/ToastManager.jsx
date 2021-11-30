/* eslint-disable no-unused-vars */ //todo remove
import React, { useEffect, useState } from "react";
import { ToastContainer, Toast, ToastHeader, ToastBody } from "react-bootstrap";

function ToastManager() {
	const [id, setId] = useState(0);
	const [toasts, setToasts] = useState([]);

	const handleAddToast = (headerText = "", bodyText = "") => {
		setToasts([
			...toasts,
			{
				id,
				header: headerText + id,
				body: bodyText,
				show: true,
			},
		]);
		setId(id + 1);
	};

	useEffect(() => {
		setToasts(toasts.filter(toast => toast.show));
		console.log(`toasts`, toasts, id);
	}, [toasts[toasts.length - 1]?.show]); //only update when the newest notification changes state

	return (
		<>
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
			<button onClick={() => handleAddToast("abc", "def")}>
				Add toast
			</button>
		</>
	);
}

export default ToastManager;
/* eslint-enable no-unused-vars */ //todo remove
