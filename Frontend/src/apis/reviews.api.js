import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_Review = `${BASE_URL}/api/v1/reviews`;

const URI = {
  createReview: `${URI_Review}/`,
  getReviewsByCourse: (courseId) => `${URI_Review}/course/${courseId}`,
  updateReview: (id) => `${URI_Review}/${id}`,
  deleteReview: (id) => `${URI_Review}/${id}`,
};

// Các hàm gọi API
const reviewsAPI = {
  createReview: (payload) => axios.post(URI.createReview, payload),
  getReviewsByCourse: (courseId) => axios.get(URI.getReviewsByCourse(courseId)),
  updateReview: (id, payload) => axios.put(URI.updateReview(id), payload),
  deleteReview: (id) => axios.delete(URI.deleteReview(id)),
};

// Custom Hooks sử dụng React Query

// 📌 Lấy danh sách đánh giá theo khóa học
export const useGetReviewsByCourse = (courseId) => {
  return useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => reviewsAPI.getReviewsByCourse(courseId),
    enabled: !!courseId, // Chỉ gọi API khi có courseId
  });
};

// 📌 Tạo đánh giá mới
export const useCreateReview = () => {
  return useMutation({
    mutationFn: (payload) => reviewsAPI.createReview(payload),
  });
};

// 📌 Cập nhật đánh giá
export const useUpdateReview = () => {
  return useMutation({
    mutationFn: ({ id, payload }) => reviewsAPI.updateReview(id, payload),
  });
};

// 📌 Xóa đánh giá
export const useDeleteReview = () => {
  return useMutation({
    mutationFn: (id) => reviewsAPI.deleteReview(id),
  });
};
