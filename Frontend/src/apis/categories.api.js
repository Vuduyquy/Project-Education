import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_Category = `${BASE_URL}/api/v1/categories`;

const URI = {
  createCategory: `${URI_Category}/`, // API để tạo danh mục
  getCategory: `${URI_Category}/`, // API để lấy danh sách danh mục
  getCategoryById: (id) => `${URI_Category}/${id}`, // API để lấy thông tin danh mục theo ID
  updateCategory: (id) => `${URI_Category}/${id}`, // API để cập nhật danh mục theo ID
  deleteCategory: (id) => `${URI_Category}/${id}`, // API để xóa danh mục theo ID
};

// Các hàm gọi API
const categories = {
  createCategory: (payload) => axios.post(URI.createCategory, payload),
  getCategory: () => axios.get(URI.getCategory),
  getCategoryById: (id) => axios.get(URI.getCategoryById(id)),
  updateCategory: (id, payload) => axios.put(URI.updateCategory(id), payload),
  deleteCategory: (id) => axios.delete(URI.deleteCategory(id)),
};

// Custom hook để lấy danh sách danh mục
export const useGetCategory = (onSuccess, onError) => {
  return useQuery({  
    queryKey: ["getCategory"], // Định danh cache query
    queryFn: async () => {
      try {
        const response = await categories.getCategory();
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error; // Đảm bảo onError được gọi
      }
    },
    onSuccess: (data) => {
      console.log("Fetched Data:", data);
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error fetching category:", error);
      if (onError && typeof onError === "function") {
        onError(error);
      }
    },
    staleTime: 5 * 60 * 1000, // Không refetch trong 5 phút
    cacheTime: 10 * 60 * 1000, // Lưu cache trong 10 phút
    retry: 3, // Thử lại tối đa 3 lần nếu lỗi
  });
};


// Hook để tạo danh mục
export const useCreateCategory = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await categories.createCategory(payload);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Created Category:", data);
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      if (onError && typeof onError === "function") {
        onError(error);
      }
    },
  });
};

// Hook để lấy danh mục theo ID
export const useGetCategoryById = (id, onSuccess, onError) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: async () => {
      try {
        const response = await categories.getCategoryById(id);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    enabled: !!id,
    onSuccess: (data) => {
      console.log("Fetched Category:", data);
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error fetching category by ID:", error);
      if (onError && typeof onError === "function") {
        onError(error);
      }
    },
  });
};

// Hook để cập nhật danh mục
export const useUpdateCategory = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      try {
        const response = await categories.updateCategory(id, payload);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Updated Category:", data);
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      if (onError && typeof onError === "function") {
        onError(error);
      }
    },
  });
};

// Hook để xóa danh mục
export const useDeleteCategory = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        const response = await categories.deleteCategory(id);
        console.log("API Response:", response);
        return response;
      } catch (error) {
        console.error("API Fetch Error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Deleted Category:", data);
      if (onSuccess && typeof onSuccess === "function") {
        onSuccess(data);
      }
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      if (onError && typeof onError === "function") {
        onError(error);
      }
    },
  });
};

