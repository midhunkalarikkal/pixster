import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
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

  subscribeToNotification: () => {
    console.log("subscribe notification")
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.on("newFollowRequest", (socketNotification) => {
      console.log("socketNotification : ",socketNotification);
      toast.info(socketNotification.message);
      const { notifications } = get();
      set({ notifications: [...notifications, socketNotification.notification] });
    });
  },

  unsubscribeFromNotification: () => {
    console.log("unsubscribe notification");
    const socket = useAuthStore.getState().socket;
    if(socket){
      socket.off("newFollowRequest");
    }
  },

}));
