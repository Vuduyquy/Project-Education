import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BASE_URL } from '../config/axios';

const URI_AUTH = `${BASE_URL}/api/v1/auth`;

const URI = {
  login: `${URI_AUTH}/login`,
  register: `${URI_AUTH}/register`,
  getAllUser: `${URI_AUTH}/`,
  getUserById: (userId) => `${URI_AUTH}/${userId}`,
  updateUser: (userId) => `${URI_AUTH}/${userId}`,
  changePassword: (userId) => `${URI_AUTH}/changePassword/${userId}`,
  requestReset: `${URI_AUTH}/forgot-password`,
  reset: `${URI_AUTH}/reset-password`,
  googleLogin: `${URI_AUTH}/auth/google`,
  googleCallback: `${URI_AUTH}/auth/google/callback`,
};

const auth = {
  login: (payload) => {
    return axios.post(URI.login, payload);
  },
  register: (payload) => {
    return axios.post(URI.register, payload);
  },
  getAllUser: () => {
    return axios.get(URI.getAllUser);
  },
  getUserById: (userId) => {
    return axios.get(URI.getUserById(userId), {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
  },
  updateUser: (user, payload) => {
    return axios.put(URI.updateUser(user), payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  changePassword: (userId, payload, token) => {
    return axios.put(URI.changePassword(userId), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  requestReset: (payload) => {
    return axios.post(URI.requestReset, payload).catch((error) => {
      // Xử lý lỗi chi tiết hơn
      throw new Error(
        error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu"
      );
    });
  },
  reset: (token, payload) => {
    return axios.post(`${URI.reset}`, payload); // Sửa từ PUT thành POST để khớp với backend
  },
  googleLogin: () => {
    window.location.href = URI.googleLogin; // Redirect trực tiếp
  },
};

export const useLogin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (payload) => auth.login(payload),
    mutationKey: ['auth', 'login'],
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
    onError: (error, variables) => {
      onError(error, variables);
    },
  });
};

export const useRegister = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (payload) => auth.register(payload),
    mutationKey: ['auth', 'register'],
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
    onError: (error, variables) => {
      onError(error, variables);
    },
  });
};

// export const useGetAllUsers = ({ onSuccess, onError }) => {
//   return useQuery({
//     queryKey: ["auth", "users"],
//     queryFn: auth.getAllUser,
//     onSuccess: (data) => {
//       onSuccess?.(data);
//     },
//     onError: (error) => {
//       onError?.(error);
//     },
//     retry: false,
//     staleTime: 1000 * 60 * 5,
//   });
// };

export const useGetAllUsers = (page = 1, limit = 5, onSuccess, onError) => {
  return useQuery({
    queryKey: ["auth", "users", page, limit], // Thêm page và limit vào queryKey để cache theo từng trang
    queryFn: async () => {
      const response = await auth.getAllUser({ page, limit }); // Gọi API với page và limit
      console.log("API Response (Users):", response);
      return response.data; // Trả về phần data từ response
    },
    onSuccess, // Gọi callback onSuccess từ tham số
    onError, // Gọi callback onError từ tham số
    keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang
    staleTime: 5 * 60 * 1000, // Dữ liệu vẫn mới trong 5 phút
    cacheTime: 10 * 60 * 1000, // Cache trong 10 phút
    retry: 3, // Thử lại 3 lần nếu thất bại
  });
};

export const useGetUserById = (userId, { onSuccess, onError }) => {
	return useQuery({
		queryKey: ["auth", "user", userId], // Key cache riêng cho từng user
		queryFn: () => auth.getUserById(userId),
		enabled: !!userId, // Chỉ fetch khi có id
		onSuccess: (data) => {
			onSuccess?.(data);
		},
		onError: (error) => {
			onError?.(error);
		},
	});
};


export const useUpdateUser = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: ({ user, payload }) => auth.updateUser(user, payload),
    mutationKey: ['auth', 'updateUser'],
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
    onError: (error, variables) => {
      onError(error, variables);
    },
  });
};


export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ userId, oldPassword, newPassword, token }) =>
      auth.changePassword(userId, { oldPassword, newPassword }, token),
    mutationKey: ["auth", "changePassword"],
  });
};

// Hook cho chức năng "Quên mật khẩu"
export const useRequestPasswordReset = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (payload) => auth.requestReset(payload),
    mutationKey: ["auth", "requestPasswordReset"],
    onSuccess: (data, variables) => {
      onSuccess?.(data.data, variables); // Trả về dữ liệu từ response
    },
    onError: (error, variables) => {
      onError?.(error.message, variables); // Trả về thông điệp lỗi chi tiết
    },
    retry: false, // Không thử lại khi gặp lỗi
  });
};

// Hook cho chức năng "Đặt lại mật khẩu"
export const useResetPassword = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: (payload) => auth.reset(null, payload), // Không cần token trong URL vì backend không yêu cầu
    mutationKey: ["auth", "resetPassword"],
    onSuccess: (data, variables) => {
      onSuccess?.(data.data, variables);
    },
    onError: (error, variables) => {
      onError?.(error.message, variables);
    },
    retry: false,
  });
};

export const useGoogleLogin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: () => auth.googleLogin(),
    mutationKey: ['auth', 'googleLogin'],
    onSuccess: () => {
      onSuccess?.(); // Không cần dữ liệu vì redirect
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};