import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_courses = `${BASE_URL}/api/v1/courses`;

const URI = {
  createCourses: `${URI_courses}/`,
  getCourses: `${URI_courses}/`,
  getCoursesById: (id) => `${URI_courses}/${id}`,
  updateCourses: (id) => `${URI_courses}/${id}`,
  deleteCourses: (id) => `${URI_courses}/${id}`,
  getUserCourses: `${URI_courses}/user`,
};

// Các hàm gọi API
const courses = {
  createCourses: (payload) => axios.post(URI.createCourses, payload),
  getCourses: () => axios.get(URI.getCourses),
  getCoursesById: (id) => axios.get(URI.getCoursesById(id)),
  updateCourses: (id, payload) => axios.put(URI.updateCourses(id), payload),
  deleteCourses: (id) => axios.delete(URI.deleteCourses(id)),
  getUserCourses: () =>
    axios.get(URI.getUserCourses, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    }),
};

// Hook để lấy danh sách khóa học
export const useGetCourses = (onSuccess, onError) => {
  return useQuery({
    queryKey: ["getCourses"],
    queryFn: async () => {
      try {
        const response = await courses.getCourses();
        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
  });
};

// Hook để lấy khóa học theo ID
export const useGetCoursesById = (id, onSuccess, onError) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      try {
        const response = await courses.getCoursesById(id);
        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    enabled: !!id,
    onSuccess,
    onError,
  });
};

// Hook để tạo khóa học
export const useCreateCourses = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (payload) => {
      console.log("Dữ liệu gửi đi:", payload);
      try {
        const response = await courses.createCourses(payload);
        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};

// Hook để cập nhật khóa học
export const useUpdateCourses = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await courses.updateCourses(id, payload);
        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};

// Hook để xóa khóa học
export const useDeleteCourses = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        const response = await courses.deleteCourses(id);
        console.log("API Response:", response);
        return response.data;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};

// Hook để lấy danh sách khóa học của người dùng đã đăng ký
export const useGetUserCourses = (onSuccess, onError) => {
  return useQuery({
    queryKey: ["userCourses"],
    queryFn: async () => {
      try {
        const response = await courses.getUserCourses();
        console.log("User Courses API Response:", response);
        return response.data;
      } catch (error) {
        console.error("User Courses API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
    retry: 3,
    enabled: !!localStorage.getItem("accessToken"), // Chỉ fetch khi có token
  });
};
