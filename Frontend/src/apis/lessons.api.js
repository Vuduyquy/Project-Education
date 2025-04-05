import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_Lesson = `${BASE_URL}/api/v1/lessons`;

const URI = {
  createLesson: `${URI_Lesson}/`, // API để tạo bài học
  getLesson: `${URI_Lesson}/`, // API để lấy danh sách bài học
  getLessonById: (id) => `${URI_Lesson}/${id}`, // API để lấy thông tin bài học theo ID
  updateLesson: (id) => `${URI_Lesson}/${id}`, // API để cập nhật bài học theo ID
  deleteLesson: (id) => `${URI_Lesson}/${id}`, // API để xóa bài học theo ID
};

// Các hàm gọi API
const lessons = {
  createLesson: (payload) => axios.post(URI.createLesson, payload),
  getLesson: () => axios.get(URI.getLesson),
  getLessonById: (id) => axios.get(URI.getLessonById(id)),
  updateLesson: (id, payload) => axios.put(URI.updateLesson(id), payload),
  deleteLesson: (id) => axios.delete(URI.deleteLesson(id)),
};

// Custom hook để lấy danh sách bài học
export const useGetLesson = (onSuccess, onError) => {
  return useQuery({
    queryKey: ["getLesson"],
    queryFn: async () => {
      try {
        const response = await lessons.getLesson();
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

// Hook để tạo bài học
export const useCreateLesson = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await lessons.createLesson(payload);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};

// Hook để lấy bài học theo ID
export const useGetLessonById = (id, onSuccess, onError) => {
  return useQuery({
    queryKey: ["lesson", id],
    queryFn: async () => {
      try {
        const response = await lessons.getLessonById(id);
        console.log("API Response:", response);
        return response;
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

// Hook để cập nhật bài học
export const useUpdateLesson = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await lessons.updateLesson(id, payload);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};

// Hook để xóa bài học
export const useDeleteLesson = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        const response = await lessons.deleteLesson(id);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};
