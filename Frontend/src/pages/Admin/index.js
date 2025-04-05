import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import DefaultLayoutAdmin from '../../layouts/DefaultLayoutAdmin';
import { AuthContext } from '../../contexts/AuthContext';
import ROLE from '../../config/role';

const Admin = () => {
	const { authState } = useContext(AuthContext);

	if (
		authState.user.role === ROLE.ADMIN ||
		authState.user.role === ROLE.TEACHER
	) {
		return (
			<DefaultLayoutAdmin>
				<Outlet />
			</DefaultLayoutAdmin>
		);
	}

	return <Navigate to='/' />;
};

export default Admin;
