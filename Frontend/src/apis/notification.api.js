// apis/notification.api.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API cho thông báo
const URI_notifications = `${BASE_URL}/api/v1/notifications`;

const URI = {
  getNotifications: `${URI_notifications}/`,
  createNotification: `${URI_notifications}/`,
  markAsRead: (id) => `${URI_notifications}/${id}/read`,
};

// Các hàm gọi API
const notifications = {
  getNotifications: () =>
    axios.get(URI.getNotifications, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  createNotification: (payload) =>
    axios.post(URI.createNotification, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
  markAsRead: (id) =>
    axios.put(URI.markAsRead(id), null, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
};

// Hook để lấy danh sách thông báo
export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await notifications.getNotifications();
      console.log("Notifications API Response:", response);
      return response.data;
    },
    enabled: !!localStorage.getItem("token"), // Chỉ fetch khi có 
    refetchInterval: 100,
  });
};

// Hook để tạo thông báo
export const useCreateNotification = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await notifications.createNotification(payload);
      console.log("Create Notification API Response:", response);
      return response.data;
    },
  });
};

// Hook để đánh dấu thông báo là đã đọc
export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await notifications.markAsRead(id);
      console.log("Mark As Read API Response:", response);
      return response.data;
    },
  });
};