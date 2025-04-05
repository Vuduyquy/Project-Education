import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../config/axios";

const URI_DISCUSSION = `${BASE_URL}/api/v1/discussions`;

const URI = {
  createDiscussion: `${URI_DISCUSSION}/`,
  getDiscussionsByCourse: (courseId) => `${URI_DISCUSSION}/course/${courseId}`,
  getDiscussionById: (id) => `${URI_DISCUSSION}/${id}`,
  addAnswer: (id) => `${URI_DISCUSSION}/${id}/answer`,
  closeDiscussion: (id) => `${URI_DISCUSSION}/${id}/close`,
};

const discussionsAPI = {
  createDiscussion: (payload) => axios.post(URI.createDiscussion, payload),
  getDiscussionsByCourse: (courseId) => axios.get(URI.getDiscussionsByCourse(courseId)),
  getDiscussionById: (id) => axios.get(URI.getDiscussionById(id)),
  addAnswer: (id, payload) => axios.post(URI.addAnswer(id), payload),
  closeDiscussion: (id) => axios.patch(URI.closeDiscussion(id)),
};

export const useCreateDiscussion = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (payload) => {
      try {
        const response = await discussionsAPI.createDiscussion(payload);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess,
    onError,
  });
};

export const useGetDiscussionsByCourse = (courseId, onSuccess, onError) => {
  return useQuery({
    queryKey: ["discussions", courseId],
    queryFn: async () => {
      const response = await discussionsAPI.getDiscussionsByCourse(courseId);
      return response.data;
    },
    enabled: !!courseId,
    onSuccess,
    onError,
  });
};

export const useGetDiscussionById = (id, onSuccess, onError) => {
  return useQuery({
    queryKey: ["discussion", id],
    queryFn: async () => {
      const response = await discussionsAPI.getDiscussionById(id);
      return response.data;
    },
    enabled: !!id,
    onSuccess,
    onError,
  });
};

export const useAddAnswer = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await discussionsAPI.addAnswer(id, payload);
      return response.data;
    },
    onSuccess,
    onError,
  });
};

export const useCloseDiscussion = (onSuccess, onError) => {
  return useMutation({
    mutationFn: async (id) => {
      const response = await discussionsAPI.closeDiscussion(id);
      return response.data;
    },
    onSuccess,
    onError,
  });
};
