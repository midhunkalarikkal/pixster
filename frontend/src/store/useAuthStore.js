import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser : null,
    isSigningUp : false,
    isLoggingIng : false,
    isUpdatingProfile : false,

    isCheckingAuth : true,

    checkAuth : async () => {
        try{
            const res = await axiosInstance.get('/auth/check');
            set({ authUser : res.data });
        }catch(error){
            console.log("error in checkAuth userAuthStore.js ",error);
            set({ authUser : null });
        }finally{
            set({ isCheckingAuth : false });
        }
    },
    
    signup :  async (data) => {
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser : res.data });
            toast.success("Account created successfully.");
        }catch(error){
            console.log("error in signup useAuthStore :",error);
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp : false });
        }
    },

    login : async (data) => {
        set({ isLogginIng : true });
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set({ authUser : res.data });
            toast.success("Logged in successfullt.");
        }catch(error){
            console.log("error in login useAuthStore : ",error);
            toast.error(error.response.data.message);
        } finally {
            set({ isLogginIng : false });
        }
    },

    logout : async () => {
        try{
            await axiosInstance.post("/auth/logout");
            set({ authUser : null });
            toast.success("Logged out successfully.");
        }catch(error){
            console.log("Error in logout useAuthStore : ",error);
            toast.error(error.response.data.message);
        }
    },

    updateProfile : async (data) => {
        set({ isUpdatingProfile: true });
        console.log("data : ", data);
        
        try {
            const res = await axiosInstance.put("/auth/update-profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            set({ authUser: res.data });
            toast.success("Profile updated successfully.");
        } catch (error) {
            console.log("Profile updation error in useAuthStore:", error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
}))