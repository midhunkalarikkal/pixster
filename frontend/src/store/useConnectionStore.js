import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useConnectionStore = create((set) => ({
    connectionStatusLoading: false,

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