import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useProfileStore = create((set) => ({
    requestedProfiles: null,
    requestedProfilesLoading: false,

    getRequestedProfiles: async () => {
        set({ requestedProfilesLoading: true });
        try{
            const res = await axiosInstance.get('/user/fetchRequestedProfiles');
            set({ requestedProfiles: res.data.users });
        }catch (error) {
            toast.error(error.res.data.message)
        }finally{
            set({ requestedProfilesLoading: false });
        }
    }
}))