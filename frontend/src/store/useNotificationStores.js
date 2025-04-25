import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useNotificationStore = create((set) => ({
  notifications: [],
  notificationsLoading: false,

  setNotifications: (updater) => 
    set((state) => ({
      notifications: 
        typeof updater === 'function' 
          ? updater(state.notifications)
          : updater                   
    })),

  getNotifications: async () => {
    set({ notificationsLoading: true });
    try {
      const res = await axiosInstance.get("/user/fetchNotifications");
      set({ notifications: res.data.notifications });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ notificationsLoading: false });
    }
  },

}));
