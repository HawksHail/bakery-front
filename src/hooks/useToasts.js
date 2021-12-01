import { useEffect, useState } from "react";

const useToasts = () => {
	const [id, setId] = useState(0);
	const [toasts, setToasts] = useState([]);

	const handleAddToast = (headerText = "", bodyText = "", variant) => {
		setToasts([
			...toasts,
			{
				id,
				variant, //bootstrap toast color
				header: headerText,
				body: bodyText,
				show: true,
			},
		]);
		setId(id + 1);
	};

	useEffect(() => {
		setToasts(toasts.filter(toast => toast.show));
	}, [toasts[toasts.length - 1]?.show]); //only update when the newest notification changes state

	return { toasts, setToasts, handleAddToast };
};

export default useToasts;
