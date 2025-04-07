import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
    searchSelectedUser: null,
    searchSelectedUserLoading: false,

    connectionStatusLoading: false,
    
    searchLoading: false,
    searchedUsers: null,

    getSearchSelectedUser: async (userId,) => {
        set({ searchSelectedUserLoading: true });
        try{
            const res = await axiosInstance.get(`/user/fetchSearchedUserProfile/${userId}`);
            set({ searchSelectedUser : res.data });
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({ searchSelectedUserLoading : false });
        }
    },

    getSearchUser: async(searchQuery) => {
        set({ searchLoading : true });
        try{
            const res = await axiosInstance.get(`/user/searchUser`,{ params : {searchQuery}});
            set({ searchedUsers: res.data.users });
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({ searchLoading : false })
        }
    },

    getFriendProfile: async (userId) => {
        set({ searchSelectedUserLoading: true });
        try{
            const res = await axiosInstance.get(`/user/friendProfile/${userId}`);
            set({ searchSelectedUser: res.data });
        }catch (error) {
            toast.error(error.response.data.message);
        }finally {
            set({ searchSelectedUserLoading: false });
        }
    },

    setSearchSelectedUser: () => {
        set({ searchSelectedUser: null});
    },

    // **** Connection Requests **** //
    sendConnectionRequest: async (toUserId, status ) => {
        set({ connectionStatusLoading : true });
        try{
            const res = await axiosInstance.post(`/connection/sendConnectionRequest/${toUserId}?status=${status}`);
            toast.success(res.data.message);
            set({ searchSelectedUser : res.data });
            return res.data.userData;
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({ connectionStatusLoading : false });
        }
    },
    
}))