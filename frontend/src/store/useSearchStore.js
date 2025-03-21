import { toast } from "react-toastify";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
    searchSelectedUser: null,
    searchSelectedUserLoading: false,
    
    searchLoading: false,
    searchedUsers: null,

    getSearchSelectedUser: async (userId,) => {
        set({ searchSelectedUserLoading: true });
        try{
            console.log("userId : ",userId);
            const res = await axiosInstance.get(`/user/fetchUserProfile/${userId}`);
            set({ searchSelectedUser : res.data });
            console.log("res : ",res);
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({ searchSelectedUserLoading : false });
        }
    },

    getSearchUser: async(searchQuery) => {
        set({ searchLoading : true });
        try{
            console.log("Api query : ",searchQuery);
            const res = await axiosInstance.get(`/user/searchUser`,{ params : {searchQuery}});
            set({ searchedUsers: res.data.users });
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({ searchLoading : false })
        }
    }
}))