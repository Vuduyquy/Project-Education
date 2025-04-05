import { Form, Input } from 'antd';

const FormRegister = ({ formRegister }) => {
	return (
		<Form name='basic' layout='vertical'>
			<Form.Item
				label='Email'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formRegister.errors.email && 'error'}
				help={formRegister.errors.email && formRegister.errors.email}
			>
				<Input
					size='large'
					name='email'
					onChange={formRegister.handleChange}
					onBlur={formRegister.handleBlur}
					value={formRegister.values.email}
				/>
			</Form.Item>
			<Form.Item
				label='Tên người dùng'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formRegister.errors.fullName && 'error'}
				help={formRegister.errors.fullName && formRegister.errors.fullName}
			>
				<Input
					size='large'
					name='fullName'
					onChange={formRegister.handleChange}
					onBlur={formRegister.handleBlur}
					value={formRegister.values.fullName}
				/>
			</Form.Item>
			<Form.Item
				label='Mật khẩu'
				rules={[
					{
						required: true,
					},
				]}
				validateStatus={formRegister.errors.password && 'error'}
				help={formRegister.errors.password && formRegister.errors.password}
			>
				<Input.Password
					size='large'
					name='password'
					onChange={formRegister.handleChange}
					onBlur={formRegister.handleBlur}
					value={formRegister.values.password}
				/>
			</Form.Item>
		</Form>
	);
};

export default FormRegister;
