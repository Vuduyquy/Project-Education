// import { useMutation, useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { BASE_URL } from "../config/axios";

// // Định nghĩa các endpoint API
// const URI_EXAMS = `${BASE_URL}/api/v1/quizzes`;

// const URI = {
//   createExam: `${URI_EXAMS}/`,
//   getExams: `${URI_EXAMS}/`,
//   getExamsbyId: (id) => `${URI_EXAMS}/${id}`,
//   putExams: (id) => `${URI_EXAMS}/${id}`,
//   deleteExams: (id) => `${URI_EXAMS}/${id}`,
// };

// // Các hàm gọi API
// const exams = {
//   createExams: (payload) => axios.post(URI.createExam, payload),
//   // getExams: () => axios.get(URI.getExams),
//   getExams: (params = {}) => axios.get(URI.getExams, { params }),
//   getExamsbyId: (id) => axios.get(URI.getExamsbyId(id)),
//   putExams: (id, payload) => axios.put(URI.putExams(id), payload),
//   deleteExams: (id) => axios.delete(URI.deleteExams(id)),
// };

// // Hook để tạo đề thi
// export const useCreateExam = (onSuccess, onError) => {
//   return useMutation({
//     mutationKey: ["createExam"], // Định danh mutation
//     mutationFn: async (payload) => {
//       const response = await exams.createExams(payload);
//       return response.data;
//     },
//     onSuccess: (data) => {
//       console.log("Created Exam:", data);
//       onSuccess?.(data);
//     },
//     onError: (error) => {
//       console.error("Error creating exam:", error);
//       onError?.(error);
//     },
//   });
// };


// //Custom hook để lấy danh sách đề thi
// // export const useGetExams = (onSuccess, onError) => {
// //   return useQuery({  
// //     queryKey: ["getexams"], // Định danh cache query
// //     queryFn: async () => {
// //       try {
// //         const response = await exams.getExams();
// //         //console.log("API Response:", response);
// //         return response;
// //       } catch (error) {
// //         console.error("API Fetch Error:", error);
// //         throw error; // Đảm bảo onError được gọi
// //       }
// //     },
// //     onSuccess: (data) => {
// //       console.log("Fetched Data:", data);
// //       if (onSuccess && typeof onSuccess === "function") {
// //         onSuccess(data);
// //       }
// //     },
// //     onError: (error) => {
// //       console.error("Error fetching exams:", error);
// //       if (onError && typeof onError === "function") {
// //         onError(error);
// //       }
// //     },
// //   });
// // };

// export const useGetExams = (params = { page: 1, limit: 5 }, onSuccess, onError) => {
//   return useQuery({
//     queryKey: ["getexams", params.page, params.limit], // Cập nhật queryKey để phản ánh tham số
//     queryFn: async () => {
//       try {
//         const response = await exams.getExams(params);
//         return response.data; // Giả định backend trả về { data, pagination }
//       } catch (error) {
//         console.error("API Fetch Error:", error);
//         throw error;
//       }
//     },
//     onSuccess: (data) => {
//       console.log("Fetched Data:", data);
//       if (onSuccess && typeof onSuccess === "function") {
//         onSuccess(data);
//       }
//     },
//     onError: (error) => {
//       console.error("Error fetching exams:", error);
//       if (onError && typeof onError === "function") {
//         onError(error);
//       }
//     },
//   });
// };

// // Hook để lấy thông tin đề thi theo ID
// export const useGetExambyId = (id, onSuccess, onError) => {
//   return useQuery({
//     queryKey: ["exams", id],
//     queryFn: async () => {
//       try {
//         const response = await exams.getExamsbyId(id);
//         //console.log("API Response:", response);
//         return response;
//       } catch (error) {
//         console.error("API Fetch Error:", error);
//         throw error;
//       }
//     },
//     enabled: !!id,
//     onSuccess: (data) => {
//       console.log("Fetched Exam:", data);
//       if (onSuccess && typeof onSuccess === "function") {
//         onSuccess(data);
//       }
//     },
//     onError: (error) => {
//       console.error("Error fetching exam by ID:", error);
//       if (onError && typeof onError === "function") {
//         onError(error);
//       }
//     },
//   });
// };

// // Hook để cập nhật thông tin đề thi
// export const usePutExam = (onSuccess, onError) => {
//   return useMutation({
//     mutationFn: async ({ id, payload }) => {
//       try {
//         const response = await exams.putExams(id, payload);
//         console.log("API Response:", response);
//         return response;
//       } catch (error) {
//         console.error("API Fetch Error:", error);
//         throw error;
//       }
//     },
//     onSuccess: (data) => {
//       console.log("Updated Exam:", data);
//       if (onSuccess && typeof onSuccess === "function") {
//         onSuccess(data);
//       }
//     },
//     onError: (error) => {
//       console.error("Error updating exam:", error);
//       if (onError && typeof onError === "function") {
//         onError(error);
//       }
//     },
//   });
// };

// // Hook để xóa đề thi
// export const useDeleteExam = (onSuccess, onError) => {
//   return useMutation({
//     mutationFn: async (id) => {
//       try {
//         const response = await exams.deleteExams(id);
//         console.log("API Response:", response);
//         return response;
//       } catch (error) {
//         console.error("API Fetch Error:", error);
//         throw error;
//       }
//     },
//     onSuccess: (data) => {
//       console.log("Deleted Exam:", data);
//       if (onSuccess && typeof onSuccess === "function") {
//         onSuccess(data);
//       }
//     },
//     onError: (error) => {
//       console.error("Error deleting exam:", error);
//       if (onError && typeof onError === "function") {
//         onError(error);
//       }
//     },
//   });
// };

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_EXAMS = `${BASE_URL}/api/v1/quizzes`;

const URI = {
  createExam: `${URI_EXAMS}/`,
  getExams: `${URI_EXAMS}/`,
  getExamsbyId: (id) => `${URI_EXAMS}/${id}`,
  putExams: (id) => `${URI_EXAMS}/${id}`,
  deleteExams: (id) => `${URI_EXAMS}/${id}`,
};

// Các hàm gọi API
const exams = {
  createExams: (payload) => axios.post(URI.createExam, payload),
  getExams: ({ page, limit }) =>
    axios.get(URI.getExams, {
      params: { page: Number(page), limit: Number(limit) }, // Ép kiểu thành number
    }),
  getExamsbyId: (id) => axios.get(URI.getExamsbyId(id)),
  putExams: (id, payload) => axios.put(URI.putExams(id), payload),
  deleteExams: (id) => axios.delete(URI.deleteExams(id)),
};

// Hook để tạo đề thi
export const useCreateExam = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (payload) => {
      console.log("Dữ liệu gửi đi:", payload);
      const response = await exams.createExams(payload);
      console.log("API Response:", response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Created Exam:", data);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      console.error("Error creating exam:", error);
      if (onError) onError(error);
    },
  });
};

// Custom hook để lấy danh sách đề thi
export const useGetExams = (page, limit, onSuccess, onError) => {
  return useQuery({
    queryKey: ["getexams", page, limit],
    queryFn: async () => {
      const response = await exams.getExams({ page, limit });
      console.log("API Response:", response);
      return response.data;
    },
    onSuccess,
    onError,
    keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang
    staleTime: 5 * 60 * 1000, // Dữ liệu vẫn mới trong 5 phút
    cacheTime: 10 * 60 * 1000, // Cache trong 10 phút
    retry: 3, // Thử lại 3 lần nếu thất bại
  });
};

// Hook để lấy thông tin đề thi theo ID
export const useGetExambyId = (id, onSuccess, onError) => {
  return useQuery({
    queryKey: ["exams", id],
    queryFn: async () => {
      const response = await exams.getExamsbyId(id);
      console.log("API Response:", response);
      return response.data;
    },
    enabled: !!id, // Chỉ chạy query khi id tồn tại
    onSuccess,
    onError,
    staleTime: 5 * 60 * 1000, // Dữ liệu vẫn mới trong 5 phút
    cacheTime: 10 * 60 * 1000, // Cache trong 10 phút
    retry: 3, // Thử lại 3 lần nếu thất bại
  });
};

// Hook để cập nhật thông tin đề thi
export const usePutExam = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await exams.putExams(id, payload);
      console.log("API Response:", response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Updated Exam:", data);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      console.error("Error updating exam:", error);
      if (onError) onError(error);
    },
  });
};

// Hook để xóa đề thi
export const useDeleteExam = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await exams.deleteExams(id);
      console.log("API Response:", response);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Deleted Exam:", data);
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      console.error("Error deleting exam:", error);
      if (onError) onError(error);
    },
  });
};