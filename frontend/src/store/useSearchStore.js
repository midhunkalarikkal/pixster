import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
    searchSelectedUser: null,
    searchSelectedUserLoading: false,
    
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
    
}))