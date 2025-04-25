import { create } from "zustand";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios";
import { useAuthFormStore } from "./useAuthFormStore";
import { persist, createJSONStorage } from "zustand/middleware";
import { useGeminiStore } from "./useGeminiStore";
// import { exportKeys, generateKeys } from "../utils/helpers";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://pixster.onrender.com";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,
      loading: false,
      authEmail: null,

      checkAuth: async () => {
        const { authUser } = get();
        try {
          if (!authUser) return;
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
        const { handleGotoVerifyOtp, startTimer } = useAuthFormStore.getState();
        set({ loading: true });
        set({ authEmail: data.email });
        try {
          const res = await axiosInstance.post("/auth/signup", data);
          handleGotoVerifyOtp();
          startTimer();
          toast.success(res.data.message);
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ loading: false });
        }
      },

      verifyOtp: async (data) => {
        const {
          stopTimer,
          forgotPassword,
          handleGotoResetPassword,
          handleGotoLogin,
        } = useAuthFormStore.getState();
        set({ loading: true });
        try {
          // const {publicKey, privateKey} = await generateKeys();
          // const keyData = await exportKeys(publicKey, privateKey);
        //   const res = await axiosInstance.post("/auth/verifyOtp",  {
        //     ...data,
        //   publicKey: keyData.publicKey,
        //   privateKey: keyData.privateKey,
        // });
          const res = await axiosInstance.post("/auth/verifyOtp", data);
          stopTimer();
          toast.success(res.data.message);
          if (forgotPassword) {
            handleGotoResetPassword();
          } else {
            handleGotoLogin();
            set({ authEmail: null });
          }
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ loading: false });
        }
      },

      login: async (data) => {
        set({ loading: true });
        set({ authEmail: data.email });
        try {
          const res = await axiosInstance.post("/auth/login",data);
          set({ authUser: res.data });
          set({ authEmail: null });
          toast.success("Logged in successfully.");
          get().connectSocket();
        } catch (error) {
          toast.error(error?.response?.data?.message);
        } finally {
          set({ loading: false });
        }
      },

      resendOtp: async (data) => {
        data = data || {};
        const { authEmail } = get();
        if (authEmail) {
          data.email = authEmail;
        }
        set({ loading: true });
        try {
          const res = await axiosInstance.post("/auth/resendOtp", data);
          return res.data;
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ loading: false });
        }
      },

      updatePassword: async (data) => {
        set({ loading: true });
        try {
          const res = await axiosInstance.post("/auth/resetPassword", data);
          return res.data;
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        const { setGeminiCaptions } = useGeminiStore.getState();
        try {
          await axiosInstance.post("/auth/logout");
          set({ authUser: null });
          toast.success("Logged out successfully.");
          get().disconnectSocket();
          setGeminiCaptions([]);
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

      changeLoading: (data) => {
        set({ loading: data });
      },

      changeAbout: (data) => {
        const { authUser } = get();
        set({
          authUser: {
            ...authUser,
            about: data,
          },
        });
      },

      changeProfileType: (data) => {
        const { authUser } = get();
        set({
          authUser : {
            ...authUser,
            public: data
          }
        })
      },
      
      setOnlineUsers: (userIds) => set({ onlineUsers : userIds }),

      // Socket implementation

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

      },

      disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
      },
    }),

    {
      name: "auth-store",
      partialize: (state) => ({
        authUser: state.authUser,
        authEmail: state.authEmail,
      }),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
