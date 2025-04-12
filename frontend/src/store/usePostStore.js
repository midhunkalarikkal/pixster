import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const usePostStore = create(() => ({

    likeOrDislikePost: async(postId) => {
        try{
            const res = await axiosInstance.put(`/post/likeOrDislikePost/${postId}`);
            return res.data;
        }catch (error) {
            toast.error(error.response.data.message);
        }
    },

    saveRemovePost: async(postId) => {
        try {
            const res = await axiosInstance.post(`/post/savePost/${postId}`);
            return res.data;
        }catch (error) {
            toast.error(error.resposen.data.message);
        }
    }

}))