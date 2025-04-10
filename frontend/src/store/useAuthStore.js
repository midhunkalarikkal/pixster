import { create } from "zustand";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import { useSearchStore } from "./useSearchStore";
import { useProfileStore } from "./useProfileStore";
import { useNotificationStore } from "./useNotificationStores";
import { persist, createJSONStorage } from 'zustand/middleware';

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create(persist((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onLineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      await axiosInstance.get("/auth/check");
      // const res = await axiosInstance.get("/auth/check");
      // set({ authUser: res.data });
      get().connectSocket();
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully.");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLogginIng: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfullt.");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLogginIng: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully.");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfileImage: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile image updated successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  removeProfileImage: async () => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/remove-profile");
      set({ authUser: res.data });
      toast.success("Profile image removed successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("followRequest", (followRequestData) => {
      const { notifications, setNotifications } = useNotificationStore.getState();
      const { incomingrequestedProfiles, setIncomingRequestedProfiles } = useProfileStore.getState();

      const newNotifications = [
        ...notifications,
        followRequestData.notification,
      ];

      const updatedProfilesList = [
        ...incomingrequestedProfiles,
        followRequestData.userData,
      ]

      setNotifications(newNotifications);
      setIncomingRequestedProfiles(updatedProfilesList);
      toast.info(followRequestData.message);
    });
    

    socket.on("requestCancel", (data) => {
      const { incomingrequestedProfiles, setIncomingRequestedProfiles } = useProfileStore();

      const updatedProfileList = incomingrequestedProfiles.filter((profile) => {
        profile._id !== data.fromUserId;
      });
      setIncomingRequestedProfiles(updatedProfileList);
    });


    socket.on("requestAccepted", (data) => {
      const { requestedProfiles } = useProfileStore.getState();
      const { setRequestedProfiles } = useProfileStore.getState();
      const { setSearchSelectedUserAcceptConnectionData } =
        useSearchStore.getState();

      setSearchSelectedUserAcceptConnectionData(
        data.connectionData,
        data.revConnectionData
      );

      if (requestedProfiles) {
        const updatedRequestedProfiles = requestedProfiles.filter(
          (profile) => profile._id !== data.fromUserId
        );
        setRequestedProfiles(updatedRequestedProfiles);
      }
    });

    socket.on("unfollowConnection", () => {
      const { setSearchSelectedUserUnfollowConnectionData } =
        useSearchStore.getState();
      setSearchSelectedUserUnfollowConnectionData();
    });

    socket.on("requestReject", (data) => {
      const { setSearchSelectedUserRejectConnectionData } =
        useSearchStore.getState();
        setSearchSelectedUserRejectConnectionData(data.connectionData, data.revConnectionData);
    });

  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}),

{
  name: 'auth-store',
  partialize: (state) => (
    { 
      authUser: state.authUser,
     }
  ),
  storage: createJSONStorage(() => localStorage),
}

));
