import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_Contact = `${BASE_URL}/api/v1/contacts`;

const URI = {
  createContact: `${URI_Contact}/`, 
  getContact: `${URI_Contact}/`, 
//   getCategoryById: (id) => `${URI_Category}/${id}`, 
//   updateCategory: (id) => `${URI_Category}/${id}`, 
//   deleteCategory: (id) => `${URI_Category}/${id}`,
}

// Các hàm gọi API
const contacts = {
    createContact: (payload) => axios.post(URI.createContact, payload),
    getContact: () => axios.get(URI.getContact),
    // getCategoryById: (id) => axios.get(URI.getCategoryById(id)),
    // updateCategory: (id, payload) => axios.put(URI.updateCategory(id), payload),
    // deleteCategory: (id) => axios.delete(URI.deleteCategory(id)),
  };

  export const useCreateContact = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: contacts.createContact,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contacts"] }); // Refresh danh sách sau khi tạo mới
      },
      onError: (error) => {
        console.error("Lỗi khi tạo contact:", error);
      },
    });
  };

  export const useGetContacts = () => {
    return useQuery({
      queryKey: ["contacts"],
      queryFn: contacts.getContact,
      select: (res) => res.data, // Lấy dữ liệu từ response
      //staleTime: 5 * 60 * 1000, // Giữ cache trong 5 phút
    });
  };