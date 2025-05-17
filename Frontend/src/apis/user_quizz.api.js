import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_Users_Quizzes = `${BASE_URL}/api/v1/users-quizzes`;

const URI = {
  createUsersQuizzes: `${URI_Users_Quizzes}/submit`, // API để tạo bài kiểm tra
  getUsersQuizzes: `${URI_Users_Quizzes}/my-quizzes`, // API để lấy danh sách bài kiểm tra của user
  getAllUserQuizzes: `${URI_Users_Quizzes}/`,
  getUsersQuizzesById: (id) => `${URI_Users_Quizzes}/${id}`, // API để lấy thông tin bài kiểm tra theo ID
  getQuizResults: (quizId) => `${URI_Users_Quizzes}/quiz/${quizId}/results`, // API để lấy danh sách kết quả bài kiểm tra
};

// Các hàm gọi API
const quizzesApi = {
  submitQuiz: (payload) => axios.post(URI.createUsersQuizzes, payload),
  getUserQuizzes: () => axios.get(URI.getUsersQuizzes),
  getUserQuizById: (id) => axios.get(URI.getUsersQuizzesById(id)),
  getQuizResults: (quizId) => axios.get(URI.getQuizResults(quizId)),
};

// Hook để nộp bài kiểm tra
export const useSubmitQuiz = (onSuccess, onError) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await quizzesApi.submitQuiz(payload);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user-quizzes"]);
      if (onSuccess) onSuccess(data);
    },
    onError,
  });
};

// Hook để lấy danh sách bài kiểm tra của user
// export const useUserQuizzes = (onSuccess, onError) => {
//   return useQuery({
//     queryKey: ["user-quizzes"],
//     queryFn: async () => {
//       try {
//         const response = await quizzesApi.getUserQuizzes();
//         console.log("API Response:", response);
//         return response;
//       } catch (error) {
//         console.error("API Fetch Error:", error);
//         throw error;
//       }
//     },
//     onSuccess,
//     onError,
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 10 * 60 * 1000,
//   });
// };

export const useUserQuizzes = (page = 1, limit = 5, onSuccess, onError) => {
  return useQuery({
    queryKey: ["user-quizzes", page, limit], // Thêm page và limit vào queryKey để cache riêng từng trang
    queryFn: async () => {
      try {
        const response = await quizzesApi.getUserQuizzes(page, limit); // Truyền page và limit vào API
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess,
    onError,
    staleTime: 5 * 60 * 1000, // Dữ liệu cũ trong 5 phút
    cacheTime: 10 * 60 * 1000, // Cache trong 10 phút
  });
};

// Hook để lấy thông tin một bài kiểm tra theo ID
export const useUserQuizById = (id, onSuccess, onError) => {
  return useQuery({
    queryKey: ["user-quiz", id],
    queryFn: async () => {
      try {
        const response = await quizzesApi.getUserQuizById(id);
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

// Hook để lấy danh sách kết quả bài kiểm tra
export const useQuizResults = (quizId, onSuccess, onError) => {
  return useQuery({
    queryKey: ["quiz-results", quizId],
    queryFn: async () => {
      try {
        const response = await quizzesApi.getQuizResults(quizId);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    enabled: !!quizId,
    onSuccess,
    onError,
  });
};
