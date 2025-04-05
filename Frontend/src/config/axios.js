import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

export const BASE_URL = 'http://localhost:4000';

const axiosInstance = axios.create({
	timeout: 10000,
});

axios.interceptors.request.use(
	(config) => {
		//console.log('config');
		const token = localStorage.getItem('token') ?? '';

		//console.log('token: ', token);

		if (token) {
			config.headers['authorization'] = `Bearer ${token}`;
		}

		//console.log('config: ', config);

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
