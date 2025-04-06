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
            const res = await axiosInstance.get(`/user/fetchUserProfile/${userId}`);
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

    sendConnectionRequest: async (toUserId, status) => {
        set({ connectionStatusLoading : true });
        try{
            console.log("sending connection request");
            const res = await axiosInstance.post(`/connection/sendConnectionRequest/${toUserId}?status=${status}`);
            console.log("res : ",res);
            toast.success(res.data.message);
            set({ searchSelectedUser : res.data });
            console.log("res.data.userData : ",res.data.userData)
            return res.data.userData;
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({ connectionStatusLoading : false });
        }
    }
}))