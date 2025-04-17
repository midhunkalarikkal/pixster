import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const usePostStore = create(( set ) => ({
    
    commentUploading: false,
    commentUploaderOpen: false,
    selectedPostId : null,
    commentsLoading: false,

    setCommentUploaderOpen: (data) => set({ commentUploaderOpen : data }),

    setSelectedPostId: (data) => set({ selectedPostId : data }),

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
    },

    uploadComment: async(data) => {
        try{
            set({ commentUploading : true });
            const res = await axiosInstance.post('/post/addComment',data);
            toast.success(res.data.message);
            return res.data.comment;
        }catch (error) {
            toast.error(error.response.data.message);
        }finally {
            set({ commentUploading : false });
        }
    },

    getComments: async (data) => {
        try {
            set({ commentsLoading : true });
            const res = await axiosInstance.get(`/post/getComments/${data.postId}`);
            return res.data.aggregatedComments;
        }catch (error) {
            toast.error(error.response.data.message);
        }finally {
            set({ commentsLoading : false });
        }
    },

    deleteComment: async (data) => {
        try {
            const res = await axiosInstance.delete(`/post/deleteComment/${data.postId}/${data.commentId}`);
            toast.success(res.data.message);
            return res.data;
        }catch (error) {
            toast.error(error.response.data.message);
        }
    },

    likeOrDislikeComment: async (data) => {
        try {
            const res = await axiosInstance.put(`/post/likeOrDislikeComment/${data.commentId}`);
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

}))