// import { jwtDecode } from 'jwt-decode';
// import { createContext, useEffect, useState } from 'react';

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
// 	const [authState, setAuthState] = useState(() => {
// 		const token = localStorage.getItem('token');

// 		return {
// 			token,
// 			user: token ? jwtDecode(token) : null,
// 		};
// 	});

// 	const login = (token) => {
// 		localStorage.setItem('token', token);
// 		setAuthState({ token, user: jwtDecode(token) });
// 	};

// 	const logout = () => {
// 		localStorage.removeItem('token');
// 		setAuthState({ token: null, user: null });
// 	};

// 	useEffect(() => {
// 		if (authState.token) {
// 			const decoded = jwtDecode(authState.token);

// 			setAuthState({
// 				...authState,
// 				user: decoded,
// 			});
// 		}
// 	}, [authState.token]);

// 	return (
// 		<AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// };

// export { AuthContext, AuthProvider };

import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(() => {
    const token = localStorage.getItem('token');

    return {
      token,
      user: token ? jwtDecode(token) : null,
    };
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthState({ token, user: jwtDecode(token) });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ token: null, user: null });
    navigate('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  // Xử lý token từ query params khi đăng nhập Google
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const error = queryParams.get('error');

    if (token) {
      login(token); // Sử dụng hàm login để lưu token và cập nhật authState
      message.success('Đăng nhập Google thành công!');
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/'); // Chuyển hướng về trang chủ
    } else if (error) {
      message.error('Đăng nhập Google thất bại: ' + error);
      navigate('/'); // Chuyển hướng về trang chủ
    }
  }, [navigate]); // Chạy một lần khi ứng dụng khởi động

  // Đồng bộ user khi token thay đổi
  useEffect(() => {
    if (authState.token && !authState.user) {
      const decoded = jwtDecode(authState.token);
      setAuthState((prev) => ({
        ...prev,
        user: decoded,
      }));
    }
  }, [authState.token]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };