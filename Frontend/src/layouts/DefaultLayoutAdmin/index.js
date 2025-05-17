import {
	DashboardOutlined,
	EditOutlined,
	FileTextOutlined,
	LoginOutlined,
	MailOutlined,
	QuestionCircleOutlined,
	UserOutlined,
	YoutubeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
const { Content, Sider } = Layout;

const DefaultLayoutAdmin = (props) => {
	const navigate = useNavigate();
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const listNav = [
		{
			key: '',
			icon: <DashboardOutlined />,
			label: 'Trang chủ',
		},
		{
			key: 'mange-exams',
			icon: <FileTextOutlined />,
			label: 'Đề thi',
			children: [
				{
					key: 'exams',
					label: 'Danh sách đề thi',
				},
				{
					key: 'exams/create',
					label: 'Tạo đề thi',
				},
			],
		},
		{
			key: 'mange-coures',
			icon: <YoutubeOutlined />,
			label: 'Khoá học',
			children: [
				{
					key: 'courses',
					label: 'Danh sách khoá học',
				},
				{
					key: 'courses/create',
					label: 'Tạo khoá học',
				},
				{
					key: 'courses/schedule',
					label: 'Tạo lịch khoá học',
				},
			],
		},
		{
			key: 'mange-lessons',
			icon: <EditOutlined />,
			label: 'Bài giảng',
			children: [
				{
					key: 'lesson',
					label: 'Danh sách bài giảng',
				},
				{
					key: 'create/lesson',
					label: 'Tạo bài giảng',
				},
			],
		},
		{
			key: 'mange-question',
			icon: <QuestionCircleOutlined />,
			label: 'Câu hỏi',
			children: [
				{
					key: 'question',
					label: 'Danh sách câu hỏi',
				},
				{
					key: 'create/question',
					label: 'Tạo câu hỏi',
				},
			],
		},
		{
			key: 'mange-users',
			icon: <UserOutlined />,
			label: 'Người dùng',
			children: [
				{
					key: 'users',
					label: 'Danh sách người dùng',
				},
	
			],
		},
		{
			key: 'mange-feedback',
			icon: <MailOutlined />,
			label: 'Hòm thư góp ý',
			children: [
				{
					key: 'feedback',
					label: 'Danh sách người liên hệ',
				},
			],
		},
		{
			key: 'logout',
			icon: <LoginOutlined />,
			label: 'Quay lại trang người dùng',
		},
	];

	const handleRedirectPage = (menu) => {
		//console.log('menu: ', menu);
		if (menu.key === 'logout') {
			navigate('/');
			return;
		}
		navigate(`./${menu.key}`);
	};

	return (
		<div className='nav-admin'>
			<Layout>
				<Layout>
					<Sider
						width={300}
						style={{
							background: colorBgContainer,
						}}
					>
						<Menu
							mode='inline'
							defaultSelectedKeys={['1']}
							defaultOpenKeys={['sub1']}
							style={{
								height: '100%',
								borderRight: 0,
							}}
							onClick={handleRedirectPage}
							items={listNav}
						/>
					</Sider>
					<Layout
						style={{
							padding: '0 24px 24px',
						}}
					>
						<Breadcrumb
							style={{
								margin: '16px 0',
							}}
						>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
							{/* <Breadcrumb.Item>List</Breadcrumb.Item>
							<Breadcrumb.Item>DefaultLayoutAdmin</Breadcrumb.Item> */}
						</Breadcrumb>
						<Content
							style={{
								padding: 24,
								margin: 0,
								minHeight: 280,
								background: colorBgContainer,
								borderRadius: borderRadiusLG,
							}}
						>
							{props.children}
						</Content>
					</Layout>
				</Layout>
			</Layout>
		</div>
	);
};
export default DefaultLayoutAdmin;
