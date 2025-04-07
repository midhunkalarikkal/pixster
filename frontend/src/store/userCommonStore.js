import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const useCommonStore = create((set) => ({
    friendProfile: null,
    friendProfileLoading: false,

    getFriendProfile: async (userId) => {
        set({ friendProfileLoading: true });
        try{
            const res = await axiosInstance.get(`/user/friendProfile/${userId}`);
            set({ friendProfile: res.data.user });
        }catch (error) {
            toast.error(error.response.data.message);
        }finally {
            set({ friendProfileLoading: false });
        }
    }
}))