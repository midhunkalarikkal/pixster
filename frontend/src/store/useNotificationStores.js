import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

export const useNotificationStore = create((set) => ({
  notifications: null,
  notificationsLoading: false,

  getNotifications: async () => {
    set({ notificationsLoading: true });
    try {
      console.log("Api calling");
      const res = await axiosInstance.get("/user/fetchNotifications");
      set({ notifications: res.data.notifications });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ notificationsLoading: false });
    }
  },
}));
