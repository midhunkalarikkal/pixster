import { toast } from "react-toastify";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSearchStore = create((set) => ({
    searchSelectedUser: null,
    searchLoading: false,
    searchedUsers: null,

    setSearchSelectedUser: (userId) => {
        set({ searchSelectedUser: userId });
    },

    searchUser: async(searchQuery) => {
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