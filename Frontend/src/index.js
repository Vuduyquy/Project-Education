import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</QueryClientProvider>
	</BrowserRouter>
);


// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google'; // Thêm import này
// import App from './App';
// import './index.css';
// import { AuthProvider } from './contexts/AuthContext';

// const queryClient = new QueryClient();

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
// 	<GoogleOAuthProvider clientId="305523985282-u32ktsjnpslnvf4h5se5gf2epavsh8nt.apps.googleusercontent.com"> {/* Thêm provider này */}
// 		<BrowserRouter>
// 			<QueryClientProvider client={queryClient}>
// 				<AuthProvider>
// 					<App />
// 				</AuthProvider>
// 			</QueryClientProvider>
// 		</BrowserRouter>
// 	</GoogleOAuthProvider>
// );