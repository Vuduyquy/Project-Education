import { notification } from 'antd';

const openNotification = ({
	type = 'success',
	message,
	description = '',
	duration = 4.5,
	placement = 'topRight',
}) => {
	notification[type]({
		message: message,
		description: description,
		duration: duration,
		placement: placement,
	});
};

export default openNotification;
