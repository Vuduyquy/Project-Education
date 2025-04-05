import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

// Định nghĩa các endpoint API
const URI_Schedule = `${BASE_URL}/api/v1/schedules`;

const URI = {
  getAllSchedules: `${URI_Schedule}/`,
  getScheduleById: (id) => `${URI_Schedule}/${id}`,
  createSchedule: `${URI_Schedule}/`,
  joinSchedule: (id) => `${URI_Schedule}/${id}/join`,
  updateSchedule: (id) => `${URI_Schedule}/${id}`,
  deleteSchedule: (id) => `${URI_Schedule}/${id}`,
  updateJoinStatus: (id, userId) => `${URI_Schedule}/${id}/users/${userId}/status`,
};

const schedules = {
  getAllSchedules: () => axios.get(URI.getAllSchedules),
  getScheduleById: (id) => axios.get(URI.getScheduleById(id)),
  createSchedule: (payload) => axios.post(URI.createSchedule, payload),
  joinSchedule: (id, payload) => axios.post(URI.joinSchedule(id), payload),
  updateSchedule: (id, payload) => axios.put(URI.updateSchedule(id), payload),
  deleteSchedule: (id) => axios.delete(URI.deleteSchedule(id)),
  updateJoinStatus: (id, userId, payload) => axios.put(URI.updateJoinStatus(id, userId), payload),
};

// Hook để lấy tất cả lịch trình
export const useGetAllSchedules = (onSuccess, onError) => {
  return useQuery({
    queryKey: ["getAllSchedules"],
    queryFn: async () => {
      try {
        const response = await schedules.getAllSchedules();
        return response.data;
      } catch (error) {
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

// Hook để lấy lịch trình theo ID
export const useGetScheduleById = (id, onSuccess, onError) => {
  return useQuery({
    queryKey: ["schedule", id],
    queryFn: async () => {
      try {
        const response = await schedules.getScheduleById(id);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    enabled: !!id,
    onSuccess,
    onError,
  });
};

// Hook để tạo lịch trình
export const useCreateSchedule = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (payload) => {
      return schedules.createSchedule(payload);
    },
    onSuccess,
    onError,
  });
};

// Hook để tham gia lịch trình
export const useJoinSchedule = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      return schedules.joinSchedule(id, payload);
    },
    onSuccess,
    onError,
  });
};

// Hook để cập nhật lịch trình
export const useUpdateSchedule = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      return schedules.updateSchedule(id, payload);
    },
    onSuccess,
    onError,
  });
};

// Hook để xóa lịch trình
export const useDeleteSchedule = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (id) => {
      return schedules.deleteSchedule(id);
    },
    onSuccess,
    onError,
  });
};

// Hook để cập nhật trạng thái tham gia lịch trình
export const useUpdateJoinStatus = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, userId, payload }) => {
      return schedules.updateJoinStatus(id, userId, payload);
    },
    onSuccess,
    onError,
  });
};
