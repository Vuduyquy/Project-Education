// src/hooks/useQuestion.js
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_Question = `${BASE_URL}/api/v1/questions`; // Điều chỉnh đường dẫn API theo cấu hình thực tế của bạn

const URI = {
  createQuestion: `${URI_Question}/`,
  getQuestions: `${URI_Question}/`,
  updateQuestion: (id) => `${URI_Question}/${id}`,
  deleteQuestion: (id) => `${URI_Question}/${id}`,
  getQuestionsByFilters: `${URI_Question}/bank`,
};

// Các hàm gọi API
const questions = {
  createQuestion: (payload) => axios.post(URI.createQuestion, payload),
  getQuestions: () => axios.get(URI.getQuestions),
  updateQuestion: (id, payload) => axios.put(URI.updateQuestion(id), payload),
  deleteQuestion: (id) => axios.delete(URI.deleteQuestion(id)),
  getQuestionsByFilters: (filters) => axios.get(URI.getQuestionsByFilters, { params: filters }),
};

// Custom hook để lấy danh sách câu hỏi
export const useGetQuestions = (onSuccess, onError) => {
  return useQuery({
    queryKey: ["getQuestions"],
    queryFn: async () => {
      try {
        const response = await questions.getQuestions();
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

// Hook để tạo câu hỏi
export const useCreateQuestion = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await questions.createQuestion(payload);
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

// Hook để cập nhật câu hỏi
export const useUpdateQuestion = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await questions.updateQuestion(id, payload);
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

// Hook để xóa câu hỏi
export const useDeleteQuestion = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        const response = await questions.deleteQuestion(id);
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

// Hook để lấy danh sách câu hỏi theo bộ lọc (questionType, category, difficulty)
export const useGetQuestionsByFilters = (filters, onSuccess, onError) => {
  return useQuery({
    queryKey: ["getQuestionsByFilters", filters], // queryKey bao gồm filters để cache riêng cho từng bộ lọc
    queryFn: async () => {
      try {
        const response = await questions.getQuestionsByFilters(filters);
        console.log("API Response (getQuestionsByFilters):", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error (getQuestionsByFilters):", error);
        throw error;
      }
    },
    onSuccess,
    onError,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
  });
};