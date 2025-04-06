import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useProfileStore = create((set) => ({
    requestedProfiles: null,
    requestedProfilesLoading: false,
    
    followingProfiles: null,
    followingProfilesLoading: false,

    notifications: null,
    notificationsLoading: false,

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
    },

    getFollowingsProfiles: async () => {
        set({ followingProfilesLoading: true });
        try{
            const res = await axiosInstance.get('/user/fetchFollowingProfiles');
            set({ followingProfiles: res.data.users });
        }catch (error) {
            toast.error(error.res.data.message)
        }finally{
            set({ followingProfilesLoading: false });
        }
    },

    getNotifications: async () => {
        set({ notificationsLoading: true });
        try{
            console.log("Api calling")
            const res = await axiosInstance.get('/user/fetchNotifications');
            set({ notifications: res.data.notifications });
        }catch (error) {
            toast.error(error.res.data.message)
        }finally{
            set({ notificationsLoading: false });
        }
    },
}))